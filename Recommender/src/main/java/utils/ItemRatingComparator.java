package utils;

import java.util.Comparator;
import recommender.models.Item;

public class ItemRatingComparator implements Comparator<Item> {

	public int compare(Item item1, Item item2) {
		if(item1.getRating()>item2.getRating()){
			return -1;
		}else if(item1.getRating()<item2.getRating()){
			return 1;
		}else{
			return 0;
		}
	}
}
