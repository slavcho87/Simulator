package recommender.context;

import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.json.JSONObject;
import recommender.strategy.Strategy;
import utils.Configurations;
import utils.ItemRatingComparator;
import recommender.models.Item;
import recommender.models.Location;
import recommender.models.Ratings;
import recommender.models.RecommenderConfig;
import com.mongodb.MongoClient;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.DBCursor;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Recommender{
	private Strategy strategy;
	private MongoClient mongoClient = null;
	private DB db = null;	
	
	@SuppressWarnings("deprecation")
	public Recommender(Configurations config){
		mongoClient = new MongoClient(config.getHostMongo(), config.getPortMongo());
		db = mongoClient.getDB(config.getNameDB());	
	}
	
	@SuppressWarnings("deprecation")
	public Recommender(Strategy strategy, Configurations config){
		this.strategy = strategy;
		mongoClient = new MongoClient(config.getHostMongo(), config.getPortMongo());
		db = mongoClient.getDB(config.getNameDB());
	}
	
	public void setStrategy(Strategy strategy){
		this.strategy = strategy;
	}
	
	public List<Item> recommend(JSONObject data){
		String mapId = (String) data.get("mapId");
		String sceneId = (String) data.get("sceneId");
		JSONArray array = data.getJSONArray("itemTypesToRecommend");
		String recommenderId = data.getString("recommender");
		String resultTypeShow = data.getString("resultTypeShow");
		Location userLocation = new Location();
		userLocation.setLatitude((Double) data.getJSONObject("location").get("latitude"));
		userLocation.setLongitude((Double) data.getJSONObject("location").get("longitude"));
		
		//cogemos las configuraciones del recomendador
		RecommenderConfig recommenderConfig = getRecommenderConfigById(recommenderId);
		
		//cogemos todos los objetos de los tipos de items seleccionados
		List<Item> itemList = new ArrayList<Item>();
		for(int index=0; index<array.length(); index++){
			String itemType = (String) array.get(index);
			itemList.addAll(getItemList(mapId, sceneId,itemType));
		}
		
		//filtramos las lista de items teniendo en cuenta la distancia maxima que está dispuesto a recorrer el usuario
		List<Item> filterItemList = new ArrayList<Item>();
		for(Item item: itemList){
			if(item.getLocation()!=null){
				double distance = distanceBetween(userLocation, item.getLocation());
				if(distance <= recommenderConfig.getMaximuDistanteToGo()){
					filterItemList.add(item);
				}
			}
		}
		
		//cogemos los datos de las valoraciones de los usuarios
		List<Ratings> ratingList = getRatings(filterItemList);
		
		List<Item> recommendedItems = this.strategy.recommend(data, filterItemList, ratingList, recommenderConfig);
		
		if(resultTypeShow.equals("nonPersonalizedRecommendation") && recommendedItems.size()==0){
			recommendedItems = nonPersonalizedRecommendation(itemList);
		}
		
		if(recommendedItems.size()>recommenderConfig.getItemsToRecommend()){
			recommendedItems = recommendedItems.subList(0, recommenderConfig.getItemsToRecommend());
		}
		
		//filtramos los items que no satisfacen el requisito de valoracion minima para ser recomendados
		List<Item> itemsToRemove = new ArrayList<Item>();
		for(Item item: recommendedItems){
			if(item.getRating()<recommenderConfig.getMinimumScore()){
				itemsToRemove.add(item);
			}
		}
		
		if(itemsToRemove.size()>0){
			recommendedItems.removeAll(itemsToRemove);
		}
		
		return recommendedItems;
	}
	
	private Location getLocation(ObjectId id) {
		DBCollection  coll = db.getCollection("locations");
		BasicDBObject query = new BasicDBObject("_id", new BasicDBObject("$eq", id));
		DBObject object = coll.findOne(query);
		
		Location location = new Location();
		location.setId(id.toString());
		location.setLatitude(Double.parseDouble((String) object.get("latitude")));
		location.setLongitude(Double.parseDouble((String) object.get("longitude")));
		
		return location;
	}

	/**
	 * 
	 * @param itemList
	 * @param itemsToRecommend
	 * @return
	 */
	private List<Item> nonPersonalizedRecommendation(List<Item> itemList) {
		List<Item> orderItemList = new ArrayList<Item>();
		
		for(Item item: itemList){
			float rating = averageRatingByItemId(item.getId());
			item.setRating(rating);
			orderItemList.add(item);
		}
		
		Collections.sort(orderItemList, new ItemRatingComparator());
		
		return orderItemList;
	}
	
	/**
	 * 
	 * @param itemId
	 * @return
	 */
	private float averageRatingByItemId(String itemId){
		int totalRating = 0;
		int numElements = 0;
		DBCollection coll = db.getCollection("ratings");
		BasicDBObject query = new BasicDBObject("itemId", new BasicDBObject("$eq", new ObjectId(itemId)));
		DBCursor cursor = coll.find(query);
		
		while(cursor.hasNext()){
			DBObject obj = cursor.next();
			int value = (Integer) obj.get("value");
			totalRating+=value;
			numElements++;
		}
		
		if(numElements!=0){
			return totalRating/numElements;
		}else{
			return 0;
		}
	}

	/**
	 * 
	 * @param itemList
	 */
	private List<Ratings> getRatings(List<Item> itemList) {
		List<Ratings> ratingList = new ArrayList<Ratings>();
		DBCollection coll = db.getCollection("ratings");
		
		for(int index=0; index<itemList.size(); index++){
			BasicDBObject query = new BasicDBObject("itemId", new BasicDBObject("$eq", new ObjectId(itemList.get(index).getId())));
			
			DBCursor cursor = coll.find(query);
			while(cursor.hasNext()){
				DBObject obj = cursor.next();
				Ratings rating = new Ratings();
				rating.setUserToken((String) obj.get("userId"));
				rating.setItemId(obj.get("itemId").toString());
				rating.setRating((Integer) obj.get("value"));
				ratingList.add(rating);
			}
		}
		
		return ratingList;
	}

	/**
	 * 
	 * @param id
	 * @return
	 */
	private RecommenderConfig getRecommenderConfigById(String id) {
		RecommenderConfig configs = new RecommenderConfig();
		DBCollection coll = db.getCollection("recommenders");
	       
		BasicDBObject query = new BasicDBObject("_id", new BasicDBObject("$eq", new ObjectId(id)));
		DBObject obj = coll.findOne(query);
		
		ObjectId idRec = (ObjectId) obj.get("_id");
		configs.setId(idRec.toString());
		configs.setPoolName((String) obj.get("poolName"));
		configs.setRecommenderType((String) obj.get("recommenderType"));
		configs.setMaximuDistanteToGo((Integer) obj.get("maximuDistanteToGo"));
		configs.setVisibilityRadius((Integer) obj.get("visibilityRadius"));
		configs.setItemsToRecommend((Integer) obj.get("itemsToRecommend"));
		configs.setMinimumScore((Integer) obj.get("minimumScore"));
		configs.setStrategyType((String) obj.get("strategyType"));
		
		return configs;
	}

	/**
	 * 
	 * @param mapId
	 * @param sceneId
	 * @param itemType
	 * @return
	 */
	private List<Item> getItemList(String mapId, String sceneId, String itemType){
		List<Item> itemList = new ArrayList<Item>();
		
		try{
	        DBCollection coll = db.getCollection("items");
	        
	        BasicDBObject query = new BasicDBObject();
	        query.append("mapId", new BasicDBObject("$eq", mapId));
	        query.append("sceneId", new BasicDBObject("$eq", sceneId));
	        query.append("itemType", new BasicDBObject("$eq", new ObjectId(itemType)));
	        
	        DBCursor cursor = coll.find(query);
	        while(cursor.hasNext()){
	        	 Item item = new Item();
	        	 DBObject obj = cursor.next();
	        	 ObjectId id = (ObjectId) obj.get("_id");
	        	 item.setId(id.toString());
	        	 item.setItemName((String) obj.get("itemName"));
	        	 
	        	 ObjectId locationId = (ObjectId) obj.get("location");
	        	 if(locationId!=null){
	        		 item.setLocation(getLocation(locationId));
	        	 }
	        	 
	        	 itemList.add(item);
	        }
		}catch(Exception e){
			System.err.println( e.getClass().getName() + ": " + e.getMessage() );
		}
		
		return itemList;
	}
	
	private List<Item> getItemList(String mapId, String sceneId){
		List<Item> itemList = new ArrayList<Item>();
		
		try{
	        DBCollection coll = db.getCollection("items");
	        
	        BasicDBObject query = new BasicDBObject();
	        query.append("mapId", new BasicDBObject("$eq", mapId));
	        query.append("sceneId", new BasicDBObject("$eq", sceneId));
	        
	        DBCursor cursor = coll.find(query);
	        while(cursor.hasNext()){
	        	 Item item = new Item();
	        	 DBObject obj = cursor.next();
	        	 ObjectId id = (ObjectId) obj.get("_id");
	        	 item.setId(id.toString());
	        	 item.setItemName((String) obj.get("itemName"));
	        	 
	        	 ObjectId locationId = (ObjectId) obj.get("location");
	        	 if(locationId!=null){
	        		 item.setLocation(getLocation(locationId));
	        	 }
	        	 
	        	 itemList.add(item);
	        }
		}catch(Exception e){
			System.err.println( e.getClass().getName() + ": " + e.getMessage() );
		}
		
		return itemList;
	}
	
	
	private double radians(double num){
		return num * Math.PI / 180;
	}
	
	/**
	 * Distance between location 1 and location 2
	 * @param item1
	 * @param item2
	 * @return
	 */
	private double distanceBetween(Location location1, Location location2){
		int R = 6357000;
		double difLat = radians(location2.getLatitude()) - radians(location1.getLatitude());
		double difLon = radians(location2.getLongitude()) - radians(location1.getLongitude());
		
		double a = (Math.sin(difLat/2)*Math.sin(difLat/2))+Math.cos(radians(location1.getLatitude()))*Math.cos(radians(location2.getLatitude()))*Math.sin(difLon/2)*Math.sin(difLon/2);
		double c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		return R*c;
	}
	
	public float itemForecas(JSONObject data){
		String recommenderId = (String) data.get("recommenderId");
		String mapId = (String) data.get("mapId");
		String sceneId = (String) data.get("sceneId");
		Location userLocation = new Location();
		userLocation.setLatitude((Double) data.getJSONObject("location").get("latitude"));
		userLocation.setLongitude((Double) data.getJSONObject("location").get("longitude"));
		
		//cogemos las configuraciones del recomendador
		RecommenderConfig recommenderConfig = getRecommenderConfigById(recommenderId);
		
		List<Item> itemList = getItemList(mapId, sceneId);
		
		//filtramos las lista de items teniendo en cuenta la distancia maxima que está dispuesto a recorrer el usuario
		List<Item> filterItemList = new ArrayList<Item>();
		for(Item item: itemList){
			if(item.getLocation()!=null){
				double distance = distanceBetween(userLocation, item.getLocation());
				if(distance <= recommenderConfig.getMaximuDistanteToGo()){
					filterItemList.add(item);
				}
			}
		}
				
		//cogemos los datos de las valoraciones de los usuarios
		List<Ratings> ratingList = getRatings(filterItemList);
		
		return strategy.itemForecas(data, itemList, ratingList, recommenderConfig);
	}
}
