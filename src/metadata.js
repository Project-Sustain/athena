export const metadata = {
  "model_framework": [
    {
      "name": "Scikit-Learn",
      "model_type": {
        "type": "STRING",
        "values": [
          "Linear Regression",
          "Support Vector Regression",
          "Logistic Regression",
          "Gradient Boosting"
        ]
      }
    },
    {
      "name": "Apache Spark",
      "model_type": {
        "type": "STRING",
        "values": [
          "Linear Regression",
          "K-Means Clustering"
        ]
      }
    },
    {
      "name": "Tensorflow",
      "model_type": {
        "type": "STRING",
        "values": [
          "TF model type 1",
          "TF model type 2",
          "TF model type 3"
        ]
      }
    },
    {
      "name": "PyTorch",
      "model_type": {
        "type": "STRING",
        "values": [
          "PyTroch model type 1",
          "PyTroch model type 2",
          "PyTroch model type 3"
        ]
      }
    }
  ],
  "collection": [
    {
      "name": "noaa_nam",
      "feature_fields": {
        "type": "STRING",
        "values": [
          "noaa feature 1",
          "noaa feature 2",
          "noaa feature 3",
          "noaa feature 4",
          "noaa feature 5"
        ]
      },
      "label_field": {
        "type": "STRING",
        "values": [
          "noaa feature 1",
          "noaa feature 2",
          "noaa feature 3",
          "noaa feature 4",
          "noaa feature 5"
        ]
      }
    },
    {
      "name": "census",
      "feature_fields": {
        "type": "STRING",
        "values": [
          "total_population",
          "median_household_income",
          "median_age"
        ]
      },
      "label_field": {
        "type": "STRING",
        "values": [
          "total_population",
          "median_household_income",
          "median_age"
        ]
      }
    }
  ],
  "spatial_field": {
    "type": "STRING",
    "values": [
      "State",
      "County",
      "Census Tract"
    ]
  },
  "gis_joins": {},
  "model_file": {
    "type": "file-input"
  },
  "validation_metric": {
    "type": "STRING",
    "values": [
      "RMSE",
      "MAE"
    ]
  },
  "validation_budget": {
    "type": "Integer",
    "values": [
      "100",
      "1000",
      "10000",
      "100000"
    ]
  }
}