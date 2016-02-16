package recommender.context;

import org.bson.types.ObjectId;
import org.json.JSONObject;
import recommender.strategy.Strategy;
import recommender.models.Item;
import com.mongodb.MongoClient;
import com.mongodb.MongoException;
import com.mongodb.WriteConcern;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.DBCursor;
import com.mongodb.ServerAddress;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Recommender{
	private Strategy strategy;
	
	public Recommender(Strategy strategy){
		this.strategy = strategy;
	}
	
	public void setStrategy(Strategy strategy){
		this.strategy = strategy;
	}
	
	public List<Item> recommend(JSONObject data){
		//lista con los identificadores de los tipos de items que quiero que me recomieden
		//private List<String> itemTypeList; 
		
		//mi longitud actual
		//private float longitude;					
		
		//mi latitud actual
		//private float latatitude;
		
		//identificador de la configuracion del recomendador
		//private String idRecommenderConfiguration;
		
		//Typo de estrategia para el recomendador
		//private StrategyType type;
		
		String mapId = (String) data.get("mapId");
		String sceneId = (String) data.get("sceneId");
		
		List<Item> itemList = getItemList(mapId, sceneId);
		return this.strategy.recommend(data, itemList);
	}
	
	@SuppressWarnings({ "resource", "deprecation"})
	private List<Item> getItemList(String mapId, String sceneId){
		List<Item> itemList = new ArrayList<Item>();
		
		try{
			MongoClient mongoClient = new MongoClient("localhost" , 27017 );
	        DB db = mongoClient.getDB("simulator");	
	        DBCollection coll = db.getCollection("items");
	        
	        BasicDBObject query = new BasicDBObject();
	        query.append("mapId", new BasicDBObject("$eq", mapId));
	        query.append("sceneId", new BasicDBObject("$eq", sceneId));
	        
	        DBCursor cursor = coll.find();
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
