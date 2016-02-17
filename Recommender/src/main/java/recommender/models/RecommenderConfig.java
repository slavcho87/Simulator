package recommender.models;

public class RecommenderConfig {
	private String id;
	private String poolName;
	private String recommenderType;
    private int maximuDistanteToGo;
    private int visibilityRadius;
    private int itemsToRecommend; 
    private int minimumScore;
    private String strategyType;
    
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getPoolName() {
		return poolName;
	}
	public void setPoolName(String poolName) {
		this.poolName = poolName;
	}
	public String getRecommenderType() {
		return recommenderType;
	}
	public void setRecommenderType(String recommenderType) {
		this.recommenderType = recommenderType;
	}
	public int getMaximuDistanteToGo() {
		return maximuDistanteToGo;
	}
	public void setMaximuDistanteToGo(int maximuDistanteToGo) {
		this.maximuDistanteToGo = maximuDistanteToGo;
	}
	public int getVisibilityRadius() {
		return visibilityRadius;
	}
	public void setVisibilityRadius(int visibilityRadius) {
		this.visibilityRadius = visibilityRadius;
	}
	public int getItemsToRecommend() {
		return itemsToRecommend;
	}
	public void setItemsToRecommend(int itemsToRecommend) {
		this.itemsToRecommend = itemsToRecommend;
	}
	public int getMinimumScore() {
		return minimumScore;
	}
	public void setMinimumScore(int minimumScore) {
		this.minimumScore = minimumScore;
	}
	public String getStrategyType() {
		return strategyType;
	}
	public void setStrategyType(String strategyType) {
		this.strategyType = strategyType;
	}
    
    
}
