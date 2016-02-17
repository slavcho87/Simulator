import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URISyntaxException;
import org.json.JSONObject;
import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import com.thoughtworks.xstream.XStream;
import recommender.context.Recommender;
import recommender.models.Item;
import recommender.models.StrategyType;
import recommender.strategy.Strategy;
import recommender.strategy.StrategyFactory;
import utils.Configurations;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Server {
	private static Socket socket;
	private static Strategy strategy;
	private static Recommender recommender;
	
	public Server() throws URISyntaxException, InterruptedException, IOException{
		try {
			Configurations configs = readBaseConfig();
			String url = configs.getHost()+":"+configs.getPort();

			socket = IO.socket(url);
			socket.connect();	
			
			recommender = new Recommender(configs);
			
			socket.on("recommend", new Emitter.Listener() {
	            public void call(Object... args) {
	                JSONObject data = (JSONObject) args[0];
	                strategy = StrategyFactory.createStrategy(StrategyType.fromString(data.getString("strategyType")));
	                recommender.setStrategy(strategy);
	        		List<Item> itemList = recommender.recommend(data);
	        		
	        		List<String> userList = new ArrayList<String>();
	        		userList.add(data.getString("token"));
	        		
	        		JSONObject result = new JSONObject();
	        		result.put("itemList", itemList);
	        		result.put("userList", userList);
	        		socket.emit("recommended items", result);
	            }
	        });
			
			socket.on("getStrategies", new Emitter.Listener() {
	            public void call(Object... args) {
	                JSONObject data = new JSONObject();
	                data.put("strategies", StrategyType.values());
	                socket.emit("strategies result", data);
	            }
	        });
			
	    } catch (URISyntaxException e) {
	    	System.out.println(e);
	    }
	}
	
	/**
	 * Read the base configutarios
	 */
	private Configurations readBaseConfig() throws IOException{
		File archivo = new File ("./configs/baseConfig.txt");
		FileReader fr = new FileReader (archivo);

		XStream xstream = new XStream();
		xstream.alias("config", Configurations.class);
		return (Configurations) xstream.fromXML(fr);
	}
	
	/**
	 * It shows a simple menu screen
	 */
	@SuppressWarnings("resource")
	private static void menu(){
		Scanner sc = new Scanner(System.in);
		String resp = "";
		do{
			System.out.println("Insert S or s to finish: ");
			resp = sc.nextLine();
			resp = resp.toUpperCase();
		}while(!resp.equals("S"));
		socket.disconnect();
		System.exit(1);	
	}
	
	public static void main(String[] args) throws URISyntaxException, InterruptedException, IOException {
		new Server();
		menu();
	}
}
