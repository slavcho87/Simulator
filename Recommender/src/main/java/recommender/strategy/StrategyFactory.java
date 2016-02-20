package recommender.strategy;

import java.util.HashMap;
import java.util.Map;
import recommender.models.StrategyType;

public class StrategyFactory {
	static Map<StrategyType, Strategy> map = new HashMap<StrategyType, Strategy>();
	
	public static Strategy createStrategy(StrategyType type){
		Strategy strategy = map.get(type);
		
		if(strategy==null){
			switch(type){
			case UserBasedStrategy: strategy = new UserBasedStrategy(); break;
			default: throw new IllegalArgumentException("The recommender type " + type + " is not recognized.");
			}
			
			map.put(type, strategy);
		}
		
		return strategy;
	}
}
