package recommender.models;

import java.util.List;

public class Configurations {
	//lista con los identificadores de los tipos de items que quiero que me recomieden
	private List<String> itemTypeList; 
	
	//mi longitud actual
	private float longitude;					
	
	//mi latitud actual
	private float latatitude;
	
	//identificador de la configuracion del recomendador
	private String idRecommenderConfiguration;
	
	//Typo de estrategia para el recomendador
	private StrategyType type;

	public List<String> getItemTypeList() {
		return itemTypeList;
	}

	public void setItemTypeList(List<String> itemTypeList) {
		this.itemTypeList = itemTypeList;
	}

	public float getLongitude() {
		return longitude;
	}

	public void setLongitude(float longitude) {
		this.longitude = longitude;
	}

	public float getLatatitude() {
		return latatitude;
	}

	public void setLatatitude(float latatitude) {
		this.latatitude = latatitude;
	}

	public String getIdRecommenderConfiguration() {
		return idRecommenderConfiguration;
	}

	public void setIdRecommenderConfiguration(String idRecommenderConfiguration) {
		this.idRecommenderConfiguration = idRecommenderConfiguration;
	}

	public StrategyType getType() {
		return type;
	}

	public void setType(StrategyType type) {
		this.type = type;
	}
}
