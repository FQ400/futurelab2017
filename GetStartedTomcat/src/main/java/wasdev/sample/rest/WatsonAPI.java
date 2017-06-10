package wasdev.sample.rest;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Application;

import com.ibm.watson.developer_cloud.natural_language_understanding.v1.model.AnalysisResults;

import wasdev.sample.watson.WatsonConnector;
import wasdev.sample.watson.WatsonCons;

@ApplicationPath("watson")
@Path("/scanText")
public class WatsonAPI  extends Application{
    
	@POST
    @Produces("application/text")
    @Consumes("application/text")
    public String connectToWatson(String url) {
      WatsonConnector watsonconnector = new WatsonConnector(WatsonCons.USERNAME, WatsonCons.PASSWORD, url);
      AnalysisResults result = watsonconnector.recognizeNaturalLanguage();
      return result.toString();

    }
}
