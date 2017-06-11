package wasdev.sample.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Application;

import org.json.*;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.ibm.watson.developer_cloud.natural_language_understanding.v1.model.AnalysisResults;

import wasdev.sample.Visitor;
import wasdev.sample.store.VisitorStore;
import wasdev.sample.store.VisitorStoreFactory;
import wasdev.sample.watson.WatsonConnector;
import wasdev.sample.watson.WatsonCons;

@ApplicationPath("watson")
@Path("/scanText")
public class WatsonAPI  extends Application{
	
	//Our database store
	VisitorStore store = VisitorStoreFactory.getInstance();
    
	@POST
    @Produces("application/text")
    @Consumes("application/text")
    public String connectToWatson(String url) {
      WatsonConnector watsonconnector = new WatsonConnector(WatsonCons.USERNAME, WatsonCons.PASSWORD, url);
      AnalysisResults result = watsonconnector.recognizeNaturalLanguage();
      return result.toString();

    }
	
	@GET
    // @Path("/") // This anotation works in Liberty but not with Tomcat/Jersey.
    @Produces({"application/json"})
    public String getVisitors() {

		if (store == null) {
			return "[]";
		}

		List<String> watsonResultList = new ArrayList<String>();
		for (Visitor doc : store.getAll()) {
			String name = doc.getWatsonResult();
			if (name != null){
				watsonResultList.add(name);
			}
		}
		
		HashMap<String, Integer> tagMap = new HashMap<>();
		
		for (int i=0; i < watsonResultList.size(); i++){
			JSONObject json = new JSONObject(watsonResultList.get(i));
			JSONArray jsonArray = json.getJSONArray("entities");
			for (int x = 0; x < jsonArray.length(); x++){
				JSONObject tag = new JSONObject(jsonArray.get(x).toString());
				String key = tag.get("text").toString().toUpperCase();
				if (tagMap.containsKey(key)){
					int tagCounter = tagMap.get(key);
					tagMap.remove(key);
					tagMap.put(key, tagCounter + 1);
				}
				else {
					tagMap.put(key, 1);
				}
			}
				
			
		}
		
		return new Gson().toJson(tagMap);
    }
}
