package recommender.context;

import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.json.JSONObject;
import recommender.strategy.Strategy;
import utils.Configurations;
import recommender.models.Item;
import recommender.models.Ratings;
import recommender.models.RecommenderConfig;
import com.mongodb.MongoClient;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.DBCursor;
import java.util.ArrayList;
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
		
		//cogemos todos los objeros de los tipos de items seleccionados
		List<Item> itemList = new ArrayList<Item>();
		for(int index=0; index<array.length(); index++){
			String itemType = (String) array.get(index);
			itemList.addAll(getItemList(mapId, sceneId,itemType));
		}
		
		//cogemos los datos de las valoraciones de los usuarios
		List<Ratings> ratingList = getRatings(itemList);
		
		//cogemos las configuraciones del recomendador
		RecommenderConfig recommenderConfig = getRecommenderConfigById(recommenderId);
		
		return this.strategy.recommend(data, itemList, ratingList, recommenderConfig);
	}
	
	/**
	 * 
	 * @param itemList
	 */
	private List<Ratings> getRatings(List<Item> itemList) {
		List<Ratings> ratingList = new ArrayList<Ratings>();
		DBCollection coll = db.getCollection("ratings");
		
		for(int index=0; index<itemList.size(); index++){
			BasicDBObject query = new BasicDBObject("itemId", new BasicDBObject("$eq", itemList.get(index).getId()));
			DBCursor cursor = coll.find(query);
			while(cursor.hasNext()){
				DBObject obj = cursor.next();
				Ratings rating = new Ratings();
				rating.setUserToken((String) obj.get("userId"));
				rating.setItemId((String) obj.get("itemId"));
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
	        	 item.setMapId((String) obj.get("mapId"));
	        	 item.setSceneId((String) obj.get("sceneId"));
	        	 itemList.add(item);
	        }
		}catch(Exception e){
			System.err.println( e.getClass().getName() + ": " + e.getMessage() );
		}
		
		return itemList;
	}
}
