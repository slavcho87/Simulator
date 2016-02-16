package recommender.strategy;

import org.json.JSONObject;

import recommender.models.Item;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.apache.mahout.cf.taste.common.TasteException;
import org.apache.mahout.cf.taste.impl.model.file.FileDataModel;
import org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity;
import org.apache.mahout.cf.taste.model.DataModel;
import org.apache.mahout.cf.taste.similarity.UserSimilarity;

public class UserBasedStrategy implements Strategy {
	public List<Item> recommend(JSONObject data, List<Item> itemList) {
		/*try {
			DataModel model = new FileDataModel(new File("/path/to/dataset.csv"));
			UserSimilarity similarity = new PearsonCorrelationSimilarity(model);
			
			
			
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (TasteException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/
		
		
		return itemList;
	
	}
}