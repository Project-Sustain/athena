# Athena UI Plan

## Progressive Disclosure

On loading the page, 4 fields should be available:

1. Allowing selection of **Model Framework** (drop-down list)
   1. Selecting a Model Framework should reveal instructions about how to save a model with that framework in a format supported by our backend engine.
   2. Allowing **Upload** of a file in one of the supported formats (disabled until Model Framework is chosen)
2. Allowing selection of **Model Category** (drop-down list)
   1. **Dataset** (list of collections supported by Model Category above)
         Selecting a valid dataset should reveal a table for that dataset, along with 2 fields:
      1. Features (drop-down? list -- multiple choices allowed)
      2. Labels (drop-down? list -- only one choice allowed)
         The table should have descriptions of the fields, units, as well as a card with a description of the dataset, and a link to it's source.
         These values, including the entries in the drop-down list for Dataset, should be populated with the Metadata collection document returned
         for each of the supported collections (keep reading further to understand).
   2. **Validation Metric** (drop-down? list, only one choice allowed)
   3. 3. A boolean **Normalize Inputs** switch that toggles between True and False
3. **Submission** button, disabled/grayed-out
   
The submission button should not be enabled until all criteria have been met to create a request to validation-service servers.

## Viewport

A viewport showing the shapes of the counties should be consistently on the screen. In addition to this, a user-selectable list of different
spatial resolutions (i.e. `COUNTY`, `STATE`) should be provided such that when the user changes the spatial resolution value,
the viewport uses the corresponding set of shapefiles to re-render the viewport.
There should also be some way of toggling between `Viewport` and `All` for spatial coverage. This just specifies the GISJOIN coverage to
validate the model on-- just the ones in the viewport, or all GISJOINs available.

## Validation Catalogue

Hard-coding values into the client should be avoided as much as possible. Instead, information about the valid value choices and supported datasets should be retrieved
from MongoDB's `validation_catalogue` collection via a sustain-query-service query (subject to change). This collection only has 1 record in it that summarizes the valid combinations of parameter selections, and provides
descriptions for the fields. The JSON source for this catalogue can be found in the [validation-service](https://github.com/Project-Sustain/validation-service)
repository. This document serves as the base for changes to the catalogue, which are then pushed to MongoDB.

- [validation_catalogue.json](https://github.com/Project-Sustain/validation-service/blob/main/resources/validation_catalogue.json)

## Collection Metadata

To display information about the supported datasets (like the aforementioned table), the `Metadata` collection should be queried in MongoDB to retrieve comprehensive information about the fields, and supporting descriptions/links.
For example, once you read the `model_catalogue`'s `supported_collections["values"]`, (i.e. `noaa_nam`), you may query MongoDB `db.Metadata.findOne({"collection": "noaa_nam"})` to find all information about NOAA NAM.
Of course, you won't be using a Mongo Shell command to do this, it would be a connection between the JS client and the server, but this is yet to be determined how to be done.

This will return a JSON metadata entry like the following:

```
{
	"_id" : ObjectId("6213dfbad1df495b8ac3cc49"),
	"name" : "NOAA NAM",
	"longName" : "National Center for Environmental Information",
	"collection" : "noaa_nam",
	"dataSource" : "https://www.ncei.noaa.gov/products/weather-climate-models/north-american-mesoscale",
	"descriptionSource" : "https://www.ncei.noaa.gov/products/weather-climate-models/north-american-mesoscale",
	"description" : "The North American Mesoscale Forecast System (NAM) is one of the National Centers For Environmental Prediction’s (NCEP) major models for producing weather forecasts. NAM generates multiple grids (or domains) of weather forecasts over the North American continent at various horizontal resolutions. Each grid contains data for dozens of weather parameters, including temperature, precipitation, lightning, and turbulent kinetic energy. NAM uses additional numerical weather models to generate high-resolution forecasts over fixed regions, and occasionally to follow significant weather events like hurricanes.",
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

With both the populated fields from what the user selected and the collection metadata from above, you can construct a validation job request object for sending.

### Request Schema

The request schema should be used to validate outgoing requests. This schema contains a version number in it, and can be retrieved from the validation-service
servers via an HTTP `GET` request to `https://sustain.cs.colostate.edu:31415/validation_service/schema`. The schema will be returned
as an JSON response with the `Content-type: application/json` header set.

- The source for the latest schema can be found here: [Validation Job Request Schema](https://github.com/Project-Sustain/validation-service/blob/main/resources/submit_validation_job_request_schema.json)

Validating a JSON object with a schema should be relatively straightforward, see [AJV](https://ajv.js.org/) for examples.

### Request Description

A brief description is given below for each of the fields. This description needs to be updated with any major changes to the schema or request format.

**v1.0.0**

- `model_framework`:
   - Description: Users select this from the Model Framework field, whose values are determined by the `model_frameworks["values"]` from the `validation_catalogue`
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
- `feature_fields`:
   - Description: A list of the selected fields for the collection chosen. While the Feature Fields list should have human-readable names from the collection metadata, this will
     be the actual field names selected from the `supported_collections.values[X].features` in the `validation-catalogue` object.
   - Default value: None
- `label_field`:
   - Description: A single selected label field for the collection chosen. While the Label Field list should have human-readable names from the collection metadata, this will
     be the actual field name selected from the `supported_collections.values[X].labels` in the `validation-catalogue` object.
   - Default value: None
- `spatial_resolution`:
   - Description: The spatial resolution the user wants to perform model validation at. Values are determined by the `spatial_resolutions["values"]` from the `validation_catalogue`
   - Default value: `COUNTY`
- `spatial_coverage`:
   - Description: The spatial coverage the user wants to perform model validation on. Values are determined by the `spatial_coverages["values"]` from the `validation_catalogue`
   - Default value: `ALL`
- `normalize_inputs`:
   - Description: A flag telling the service whether to normalize the input data from MongoDB before feeding it to the model. This comes from the toggle switch in the UI.
   - Default value: `true`
- `loss_function`:
   - Description: This comes from the Validation Metric field, whose values are generated by the `validation_metrics["values"]` from the `validation_catalogue`.
   - Default value: `MEAN_SQUARED_ERROR`
- `gis_joins`:
   - Description: This is a list of GISJOIN values based on the current shapes within the user's map viewport. This should only be included in the request if the user has selected 
     `spatial_coverage` of `SUBSET`.
   - Default value: None

Example v1.0.0 request:

```json
{
  "model_framework": "TENSORFLOW",
  "model_category": "REGRESSION",
  "database": "sustaindb",
  "collection": "noaa_nam",
  "feature_fields": [
    "PRESSURE_REDUCED_TO_MSL_PASCAL",
    "VISIBILITY_AT_SURFACE_METERS",
    "VISIBILITY_AT_CLOUD_TOP_METERS",
    "WIND_GUST_SPEED_AT_SURFACE_METERS_PER_SEC",
    "PRESSURE_AT_SURFACE_PASCAL",
    "TEMPERATURE_AT_SURFACE_KELVIN",
    "DEWPOINT_TEMPERATURE_2_METERS_ABOVE_SURFACE_KELVIN",
    "RELATIVE_HUMIDITY_2_METERS_ABOVE_SURFACE_PERCENT",
    "ALBEDO_PERCENT",
    "TOTAL_CLOUD_COVER_PERCENT"
  ],
  "label_field": "SOIL_TEMPERATURE_0_TO_01_M_BELOW_SURFACE_KELVIN",
  "normalize_inputs": true,
  "spatial_resolution": "COUNTY",
  "loss_function": "MEAN_SQUARED_ERROR",
  "spatial_coverage": "ALL"
}
```


