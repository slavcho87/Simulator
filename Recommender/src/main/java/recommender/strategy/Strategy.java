package recommender.strategy;

import org.json.JSONObject;

public interface Strategy {
	public void recommend(JSONObject data);
}
