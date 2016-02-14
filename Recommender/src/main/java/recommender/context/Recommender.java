package recommender.context;

import java.util.List;

import org.json.JSONObject;

import recommender.models.StrategyType;
import recommender.strategy.Strategy;

public class Recommender{
	private Strategy strategy;
	
	public Recommender(Strategy strategy){
		this.strategy = strategy;
	}
	
	public void setStrategy(Strategy strategy){
		this.strategy = strategy;
	}
	
	public void recommend(JSONObject data){
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
		this.strategy.recommend(data);
	}
}
