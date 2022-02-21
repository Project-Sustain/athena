# Athena UI Plan

## Progressive Disclosure

On loading the page, 3 fields should be available:
1. Allowing upload of a file (upload button)
2. Allowing selection of Model Framework (drop-down? list)
3. Allowing selection of Model Category (drop-down? list)
4. Submission button, disabled

Selecting valid values should reveal two more fields:
1. Dataset (list of collections supported by Model Category above)
   Selecting a valid dataset should reveal a table for that dataset, along with 2 fields:
   1. Features (drop-down? list -- multiple choices allowed)
   2. Labels (drop-down? list -- only one choice allowed)
   The table should have descriptions of the fields, units, as well as a card with a description of the dataset, and a link to it's source.
   These values, including the entries in the drop-down list for Dataset, should be populated with the Metadata collection document returned
   for each of the supported collections (keep reading further to understand).
2. Validation Budget Type (list of budget types, i.e. limit or sample)
   Selecting a budget type should reveal a card with a description of the budget type, and a control mechanism for choosing the budget value.
   allowing control of the value of the budget. In the case of limit and sample, they should just be sliders from the `min` value to the `max` value, inclusive.
3. A boolean Normalize Inputs switch that toggles between True and False
4. Validation Metric (drop-down? list, only one choice allowed)
   
The submission button should not be enabled until all criteria have been met to create a request to validation-service servers.

## Validation Catalogue

Hardcoding values into the client should be avoided as much as possible. Instead, information about the valid value choices and supported datasets should be retrieved
from MongoDB's `validation_catalogue` collection. This collection only has 1 record in it that summarizes the valid combinations of parameter selections, and provides
descriptions for the fields.

```bson
{
  "model_frameworks": {
    "description": "Supported model validation frameworks",
    "values": ["Tensorflow", "Scikit-Learn", "PyTorch", ...]
  },
  "model_categories": {
    "description": "Supported categories of models to be evaluated",
    "values": ["Regression", ...]
  },
  "supported_collections": {
    "description": "Collections supported to evaluate a model on",
    "values": [
      {
        "name": "noaa_nam",
        "features": ["TOTAL_CLOUD_COVER_PERCENT", ...],
        "labels": ["PRESSURE_REDUCED_TO_MSL_PASCAL", ...],
        "model_categories_supported": ["Regression", ...]
      },
      ...
    ]
  },
  "validation_metrics": {
    "description": "Validation metric for determining how a model performs",
    "values": ["loss", "accuracy", ...]
  },
  "validation_budgets": {
    "description": "Sampling and limiting budgets for validating a model",
    "values": [
      {
        "budget": "limit",
        "description": "Limits the number of records returned for a given GISJOIN to a specified amount",
        "type": "Integer",
        "min": 1,
        "max": 100000
      },
      {
        "budget": "sample",
        "description": "Samples the records returned for a given GISJOIN at a specified rate",
        "type": "Double",
        "min": 0.1,
        "max": 1.0
      }
    ]
  }
}
```

The `model_catalogue` JSON object should be queried from MongoDB when the client loads the page for the first time, and used to populate the lists for field selection.
This should provide enough information to build a full request to the server with.


## Collection Metadata

To display information about the supported datasets (like the aforementioned table), the `Metadata` collection should be queried in MongoDB to retrieve comprehensive information about the fields, and supporting descriptions/links.
For example, once you read the `model_catalogue`'s `supported_collections["values"], (i.e. `noaa_nam`), you may query MongoDB `db.Metadata.findOne({"collection": "noaa_nam"})` to find all information about NOAA NAM.
Of course, you won't be using a Mongo Shell command to do this, it would be a connection between the JS client and the server, but this is yet to be determined how to be done.

This will return a JSON metadata entry like the following:

```bson
{
	"_id" : ObjectId("6213dfbad1df495b8ac3cc49"),
	"name" : "NOAA NAM",
	"longName" : "National Center for Environmental Information",
	"collection" : "noaa_nam",
	"dataSource" : "https://www.ncei.noaa.gov/products/weather-climate-models/north-american-mesoscale",
	"descriptionSource" : "https://www.ncei.noaa.gov/products/weather-climate-models/north-american-mesoscale",
	"description" : "The North American Mesoscale Forecast System (NAM) is one of the National Centers For Environmental Prediction’s (NCEP) major models for producing weather forecasts. NAM generates multiple grids (or domains) of weather forecasts over the North American continent at various horizontal resolutions. Each grid contains data for dozens of weather parameters, including temperature, precipitation, lightning, and turbulent kinetic energy. NAM uses additional numerical weather models to generate high-resolution forecasts over fixed regions, and occasionally to follow significant weather events like hurricanes.",
	"spatialKey" : "COUNTY_GISJOIN",
	"temporalKey" : "TIMESTAMP",
	"fieldMetadata" : [
		{
			"name" : "Grid row index of observation",
			"field" : "ROW",
			"unit" : "Index",
			"type" : "Integer",
			"accumulationOrInstant" : "N/A"
		},
		{
			"name" : "Grid column index of observation",
			"field" : "COL",
			"unit" : "Index",
			"type" : "Integer",
			"accumulationOrInstant" : "N/A"
		},
    ...
  ]
}
```

Once you have this information, CACHE IT. Don't just keep making the request if you already have it in memory. This means you'll have to build appropriate data structures
on the client-side to make it easier to do lookups and joins, rather than relying on the metadata/catalogue collections to have these in an already-easy format.

## Validation Job Request

With both the populated fields from what the user selected, and the collection metadata from above, you can construct a validation job request object for sending.

- `job_mode`: 
   - Description: This is intended to be used only in running experiments/benchmarks. The user should not be able to select this.
   - Default value: `"asynchronous"`
- `model_framework`:
   - Description: Users select this from the Model Framework field, whose values are determined by the `model_frameworks["values"]` from the `validation_catalogue`
   - Default value: None
- `model_category`:
   - Description: Users select this from the Model Category field, whose values are determined by the `model_categories["values"]` from the `validation_catalogue`
   - Default value: None
- `database`:
   - Description: This is intended to be used only in running experiments/benchmarks. The user should not be able to select this.
   - Default value: `"sustaindb"`
- `collection`:
   - Description: Users select this from the Dataset field. The values of the Dataset field are determined by 1st iterating over 
     all the `validation_catalogue.supported_collections.values`, getting the `"name"` field, then using that to query MongoDB for the collection metadata.
     This collection metadata should include a `"name"` field, use _that_ to populate the Dataset field list.
   - Default value: None
- `gis_join_key`:
   - Description: Denotes the GISJOIN field key in the collection. Similar to above, you'll have to query the collection metadata, then get the `spatialKey` field from that.
   - Default value: None
- `feature_fields`:
   - Description: A list of the selected fields for the collection chosen. While the Features field list should have human-readable names from the collection metadata, this will
     be the actual field names selected from the `supported_collections.values[X].features` in the `validation-catalogue` object.
   - Default value: None
- `label_field`:
   - Description: A single selected label field for the collection chosen. While the Labels field list should have human-readable names from the collection metadata, this will
     be the actual field name selected from the `supported_collections.values[X].labels` in the `validation-catalogue` object.
   - Default value: None
- `normalize_inputs`:
   - Description: A flag telling the service whether or not to normalize the input data from MongoDB before feeding it to the model. This comes from the toggle switch in the UI.
   - Default value: `true`
- `limit`:
   - Description: This comes from the Validation Budget slider, which is generated by the `model_catalogue.validation_budget.values`
   - Default value: `0`
- `sample_rate`:
   - Description: This comes from the Validation Budget slider, which is generated by the `model_catalogue.validation_budget.values`
   - Default value: `0.0`
- `validation_metric`:
   - Description: This comes from the Validation Metric field, which is generated by the `model_catalogue.validation_metric.values`
   - Default value: None
- `gis_joins`:
   - Description: This is a list of GISJOIN values, based on the current shapes within the user's map viewport.
   - Default value: `[]`


Example:

```json
{
  "job_mode": "asynchronous",
  "model_framework": "Tensorflow",
  "model_type": "Regression",
  "database": "sustaindb",
  "collection": "noaa_nam",
  "gis_join_key": "COUNTY_GISJOIN",
  "feature_fields": [
    "PRESSURE_AT_SURFACE_PASCAL",
    "RELATIVE_HUMIDITY_2_METERS_ABOVE_SURFACE_PERCENT"
  ],
  "label_field": "TEMPERATURE_AT_SURFACE_KELVIN",
  "normalize_inputs": true,
  "limit": 0,
  "sample_rate": 0.0,
  "validation_metric": "loss",
  "gis_joins": [
    "G2000190",
    "G2000090",
    "G2000670",
    "G2000610",
    "G2000250",
    "G2000070",
    "G2000030",
    "G2000470"
  ]
}
```


