package utils;

public class Configurations {
	private String host;
	private String port;
	private String hostMongo;
	private int portMongo;
	private String nameDB;
	
	public Configurations(String host, String port){
		this.host = host;
		this.port = port;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}

	public String getHostMongo() {
		return hostMongo;
	}

	public void setHostMongo(String hostMongo) {
		this.hostMongo = hostMongo;
	}

	public int getPortMongo() {
		return portMongo;
	}

	public void setPortMongo(int portMongo) {
		this.portMongo = portMongo;
	}

	public String getNameDB() {
		return nameDB;
	}

	public void setNameDB(String nameDB) {
		this.nameDB = nameDB;
	}
}
