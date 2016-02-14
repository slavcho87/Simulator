package recommender.models;

public enum StrategyType {
	UserBasedStrategy("User based recommender");
	
	private String text;
	
	StrategyType(String text) {
	    this.text = text;  
	}
	
	public String getText() {
	    return this.text;
	}

	public static StrategyType fromString(String text) {
		if (text != null) {
			for (StrategyType b : StrategyType.values()) {
		        if (text.equalsIgnoreCase(b.text)) {
		          return b;
		        }
			}
		}
	    
		return null;
	}
}
