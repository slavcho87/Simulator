package rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import recommender.context.Recommender;
import recommender.models.Configurations;
import recommender.strategy.Strategy;
import recommender.strategy.StrategyFactory;
import recommender.models.StrategyType;

@Produces(value={"application/json"})

@Path("/services")
public class Services {
	private Strategy strategy;
	private Recommender recommender;
	
	@GET
	@Path("/recommend")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public void recommend(Configurations config)
	{
		strategy = StrategyFactory.createStrategy(config.getType());
		recommender = new Recommender(strategy);
		recommender.recommend(config);
	}
	
	@GET
	@Path("/getStrategies")
	@Produces(MediaType.APPLICATION_JSON)
	public StrategyType[] getStrategies(){
		return StrategyType.values();
	}
}
