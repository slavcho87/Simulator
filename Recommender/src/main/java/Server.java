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
import recommender.models.StrategyType;
import recommender.strategy.Strategy;
import recommender.strategy.StrategyFactory;
import utils.Configurations;
import java.util.Scanner;

public class Server {
	private Socket socket;
	private Strategy strategy;
	private Recommender recommender;
	
	public Server() throws URISyntaxException, InterruptedException, IOException{
		try {
			Configurations configs = readBaseConfig();
			String url = configs.getHost()+":"+configs.getPort();

			socket = IO.socket(url);
			socket.connect();	
			
			socket.on("recommend", new Emitter.Listener() {
	            public void call(Object... args) {
	                JSONObject data = (JSONObject) args[0];
	                strategy = StrategyFactory.createStrategy(StrategyType.fromString(data.getString("type")));
	        		recommender = new Recommender(strategy);
	        		recommender.recommend(data);
	            }
	        });
			
			socket.on("getStrategies", new Emitter.Listener() {
	            public void call(Object... args) {
	                JSONObject data = new JSONObject();
	                data.put("strategies", StrategyType.values());
	                socket.emit("strategies result", data);
	            }
	        });
			
			menu();
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
	private void menu(){
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
	}
}
