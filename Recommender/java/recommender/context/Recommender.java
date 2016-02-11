package recommender.context;

import recommender.strategy.Strategy;

public class Recommender implements InterfazRecommender{
	private Strategy strategy;
	
	public Recommender(Strategy strategy){
		this.strategy = strategy;
	}
	
	public void setStrategy(Strategy strategy){
		this.strategy = strategy;
	}
	
	//tenemos que añadir los metodos del recomendador
	public void recommend(){
		this.strategy.recommend();
	}
}
