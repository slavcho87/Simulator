package servers;

import java.util.ArrayList;
import java.util.List;
import org.json.JSONObject;
import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.Socket;
import recommender.context.Recommender;
import recommender.models.Item;
import recommender.models.StrategyType;
import recommender.strategy.Strategy;
import recommender.strategy.StrategyFactory;
import utils.Configurations; 

public class PullServer implements Runnable{
	private Socket socket;
	private Strategy strategy;
	private Recommender recommender;
	private Configurations configs;
	
	public PullServer(Configurations configs, Socket socket){
		this.configs = configs;
		this.socket = socket;
	}

	public Socket getSocket() {
		return socket;
	}

	public void setSocket(Socket socket) {
		this.socket = socket;
	}

	public Strategy getStrategy() {
		return strategy;
	}

	public void setStrategy(Strategy strategy) {
		this.strategy = strategy;
	}

	public Recommender getRecommender() {
		return recommender;
	}

	public void setRecommender(Recommender recommender) {
		this.recommender = recommender;
	}

	public Configurations getConfigs() {
		return configs;
	}

	public void setConfigs(Configurations configs) {
		this.configs = configs;
	}
	
	public void run() {		
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
	}
}
