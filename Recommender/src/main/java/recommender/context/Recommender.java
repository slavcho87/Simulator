package recommender.context;

import recommender.models.Configurations;
import recommender.strategy.Strategy;

public class Recommender{
	private Strategy strategy;
	
	public Recommender(Strategy strategy){
		this.strategy = strategy;
	}
	
	public void setStrategy(Strategy strategy){
		this.strategy = strategy;
	}
	
	public void recommend(Configurations config){
		this.strategy.recommend(config);
	}
}
