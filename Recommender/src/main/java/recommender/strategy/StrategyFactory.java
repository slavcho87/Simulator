package recommender.strategy;

import recommender.models.StrategyType;

public class StrategyFactory {
	public static Strategy createStrategy(StrategyType type){
		switch(type){
		case UserBasedStrategy: return new UserBasedStrategy();
		default: throw new IllegalArgumentException("The recommender type " + type + " is not recognized.");
		}
	}
}
