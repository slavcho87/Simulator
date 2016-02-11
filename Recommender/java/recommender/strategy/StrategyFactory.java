package recommender.strategy;

public class StrategyFactory {
	public enum StrategyType{
		UserBasedStrategy
	}
	
	public static Strategy createStrategy(StrategyType type){
		switch(type){
		case UserBasedStrategy: return new UserBasedStrategy();
		default: throw new IllegalArgumentException("The recommender type " + type + " is not recognized.");
		}
	}
}
