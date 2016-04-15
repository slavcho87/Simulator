package recommender.strategy;

import java.util.List;
import org.json.JSONObject;
import recommender.models.Item;
import recommender.models.Ratings;
import recommender.models.RecommenderConfig;

public interface Strategy {
	public List<Item> recommend(JSONObject data, List<Item> itemList, List<Ratings> ratingList, RecommenderConfig recommenderConfig);
	public float itemForecas(JSONObject data, List<Item> itemList, List<Ratings> ratingList, RecommenderConfig recommenderConfig);
}
