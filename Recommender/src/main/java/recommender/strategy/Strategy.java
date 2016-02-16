package recommender.strategy;

import java.util.List;
import org.json.JSONObject;
import recommender.models.Item;

public interface Strategy {
	public List<Item> recommend(JSONObject data, List<Item> itemList);
}
