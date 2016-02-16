package recommender.models;

public enum StrategyType {
	UserBasedStrategy("User based recommender");
	
	private String type;
	
	StrategyType(String type) {
	    this.type = type;  
	}
	
	public String getType() {
	    return this.type;
	}

	public static StrategyType fromString(String type) {
		if (type != null) {
			for (StrategyType b : StrategyType.values()) {
		        if (type.equalsIgnoreCase(b.type)) {
		          return b;
		        }
			}
		}
	    
		return null;
	}
}
