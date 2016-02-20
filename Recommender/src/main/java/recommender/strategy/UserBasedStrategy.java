package recommender.strategy;

import org.json.JSONObject;
import recommender.models.Item;
import recommender.models.Ratings;
import recommender.models.RecommenderConfig;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.apache.mahout.cf.taste.common.TasteException;
import org.apache.mahout.cf.taste.impl.neighborhood.ThresholdUserNeighborhood;
import org.apache.mahout.cf.taste.impl.recommender.GenericUserBasedRecommender;
import org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity;
import org.apache.mahout.cf.taste.model.DataModel;
import org.apache.mahout.cf.taste.model.PreferenceArray;
import org.apache.mahout.cf.taste.neighborhood.UserNeighborhood;
import org.apache.mahout.cf.taste.recommender.RecommendedItem;
import org.apache.mahout.cf.taste.recommender.UserBasedRecommender;
import org.apache.mahout.cf.taste.similarity.UserSimilarity;
import org.apache.mahout.cf.taste.impl.common.FastByIDMap;
import org.apache.mahout.cf.taste.impl.model.GenericDataModel;
import org.apache.mahout.cf.taste.impl.model.GenericUserPreferenceArray;

public class UserBasedStrategy implements Strategy {
	public List<Item> recommend(JSONObject data, List<Item> itemList, List<Ratings> ratingList, RecommenderConfig recommenderConfig) {
		List<Item> recommendedItemIdList = new ArrayList<Item>();
		int indice = 0;
		FastByIDMap<PreferenceArray> preferences = new FastByIDMap<PreferenceArray>();
		
		//prepare users preferences
		Map<String, Integer> userIdMap = new HashMap<String, Integer>();
		Map<String, List<Ratings>> map = orderRatingsByUser(ratingList);
		Set<String> keyList= map.keySet();
		for(String key: keyList){
			List<Ratings> ratingsByUser = map.get(key);
			userIdMap.put(key, indice);

			PreferenceArray userPreference = new GenericUserPreferenceArray(ratingsByUser.size());
			for(int index=0; index<ratingsByUser.size(); index++){
				Ratings rating = ratingsByUser.get(index);
				userPreference.setUserID(0, Long.valueOf(key.hashCode()));
				userPreference.setItemID(index, Long.valueOf(rating.getItemId().hashCode()));
				userPreference.setValue(index, Long.valueOf(rating.getRating()));
			}
			
			preferences.put(indice, userPreference);
			indice++;
		}
		
		try {
			DataModel model = new GenericDataModel(preferences);
			UserSimilarity similarity = new PearsonCorrelationSimilarity(model);
			UserNeighborhood neighborhood =  new ThresholdUserNeighborhood(0.1, similarity, model);
			UserBasedRecommender recommender = new GenericUserBasedRecommender(model, neighborhood, similarity);
			
			List<RecommendedItem> recommendations = recommender.recommend(userIdMap.get(data.get("token")), recommenderConfig.getItemsToRecommend());
			for(RecommendedItem recItem: recommendations){
				recommendedItemIdList.add(findItemID(itemList, recItem.getItemID()));
			}
		} catch (TasteException e) {
			e.printStackTrace();
		} 
		
		return recommendedItemIdList;
	}
	
	/**
	 * 
	 * @param itemList
	 * @param itemID
	 * @return
	 */
	private Item findItemID(List<Item> itemList, Long itemID){
		for(Item item: itemList){
			if(Long.valueOf(item.getId().hashCode()).equals(itemID)){
				return item;
			}
		}
		return null;
	}
	
	/**
	 * 
	 * @param ratingList
	 * @return
	 */
	private Map<String, List<Ratings>> orderRatingsByUser(List<Ratings> ratingList){
		Map<String, List<Ratings>> map = new HashMap<String, List<Ratings>>();
		
		for(int index=0; index<ratingList.size(); index++){
			Ratings rating = ratingList.get(index);
			
			List<Ratings> ratingListByUser = map.get(rating.getUserToken());	
			if(ratingListByUser==null){
				List<Ratings> list = new ArrayList<Ratings>();
				list.add(rating);
				map.put(rating.getUserToken(), list);
			}else{
				map.get(rating.getUserToken()).add(rating);
			}
		}
		
		return map;
	}
}