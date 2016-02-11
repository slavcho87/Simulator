package rest;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import recommender.context.Recommender;
import recommender.strategy.Strategy;
import recommender.strategy.StrategyFactory;
import recommender.strategy.StrategyFactory.StrategyType;

@Produces(value={"application/json"})

@Path("/")
public class Services {
	private Strategy strategy;
	private Recommender recommender;
	
	@GET
	@Path("/recommend")
	public void recommend(@PathParam("type") StrategyFactory.StrategyType type, @PathParam("items") List<String> itemList){	
		strategy = StrategyFactory.createStrategy(type);
		recommender = new Recommender(strategy);
		recommender.recommend();
	}
	
	@GET
	@Path("/getStrategies")
	public StrategyType[] getStrategies(){
		return StrategyFactory.StrategyType.values();
	}
}
