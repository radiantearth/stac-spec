# Introduction

This API spec covers the REST(ish) APIs delivered with Hexagon Geospatial's ERDAS APOLLO product. The full API suite
covers much more than just catalog APIs, and is included in the spec here, but this document will focus on the catalog
related APIs.

The current swagger-ui API Console for these APIs is available at the 
[APOLLO demo site](https://demo-apollo.hexagongeospatial.com/erdas-apollo/api-docs/). Login with demo/demo123.

# Overview

The APOLLO API can generally be divided into two sections: catalog APIs and data management APIs.

## Catalog APIs

These APIs will be of most relevance to this effort. In the API Console, the catalog APIs consist of the entries from
Entire Catalog through Videos. These are typical REST CRUD APIs for managing the items in the APOLLO catalog. The use of
swagger to document these APIs is a relatively new addition to the product and is still somewhat of a work in progress,
as many of the example models/payloads/responses are not fully complete. 

## Data Management APIs

The remaining APIs are typically for adding data to the catalog (crawling) and some light manipulation of the data after 
it has been crawled into the catalog. These APIs aren't directly relevant to this workshop so they are not detailed 
here, but if there is interest we are happy to explain them in further detail. The demo API Console also documents these
APIs pretty well.

# Catalog API Notes

## Imagery spec

JSON ImageReference document (partial):

```
{
      "acquisitionInfo": {
        "acquisitionDate": "2017-10-19T03:30:32Z",
        "acquisitionLevelMask": 1118464,
        "availabilityDate": "2017-10-19T03:30:32Z",
        "dataAcquired": true,
        "dataProcessed": true,
        "errorValue": 101,
        "lastModificationDate": null,
        "metadataAcquired": true,
        "processingLevel": null,
        "qualityValue": 101,
        "resolution": 1
      },
      "attachments": {
        "default": {
          "lastUpdated": "2017-10-19T03:30:34Z",
          "mimeType": "text/xml; charset=utf-8",
          "name": "default"
        },
        "thumbnail": {
          "lastUpdated": "2017-10-19T18:07:33Z",
          "mimeType": "image/png",
          "name": "thumbnail",
          "path": "file:/E:/EAStorage/storage/legend/coverage/EAIM/GEOPROCESSING/demo/demo_3_Band/IMAGINE.Portal_SDK_Painted_Relief-2017-10-18-22-30-29/TTI762FBP_BEA.png"
        }
      },
      "children": [], // list of children
      "creationDate": null,
      "czsEnabled": true,
      "decoderName": "img",
      "defaultAttachmentName": "default",
      "description": "Output painted relief image",
      "domainSetExtent": {
        "elevationExtent": null,
        "spatialExtent": {
          "boundingGeometry": { // custom geometry format
            "cardinality": 2,
            "data": [
              [
                2174650,
                1518850,
                2234450,
                1518850,
                2234450,
                1555550,
                2174650,
                1555550
              ]
            ],
            "envelope": [
              2174650,
              1518850,
              2234450,
              1555550,
              "EPSG:2240"
            ],
            "epsgId": 2240,
            "srs": "EPSG:2240",
            "type": "polygon"
          },
          "dataProcessingLevel": 1,
          "dataType": 5,
          "envelope": [
            2174650,
            1518850,
            2234450,
            1555550,
            "EPSG:2240"
          ],
          "georectified": true,
          "georeferenced": true,
          "latLongBoundingBox": [
            -84.57030203228437,
            34.174634992682975,
            -84.37210301776302,
            34.275977902783595,
            "EPSG:4326"
          ],
          "pixelSpace": false,
          "srs": {
            "epsgid": 2240,
            "srs": "EPSG:2240"
          },
          "verticalDatum": null,
          "xExtent": {
            "continuousRange": false,
            "maximum": {
              "string": "2234450.0",
              "typeName": "double"
            },
            "minimum": {
              "string": "2174650.0",
              "typeName": "double"
            },
            "resolution": {
              "string": "100.0",
              "typeName": "double"
            },
            "singleValue": false,
            "size": 598
          },
          "yExtent": {
            "continuousRange": false,
            "maximum": {
              "string": "1555550.0",
              "typeName": "double"
            },
            "minimum": {
              "string": "1518850.0",
              "typeName": "double"
            },
            "resolution": {
              "string": "100.0",
              "typeName": "double"
            },
            "singleValue": false,
            "size": 367
          },
          "zExtent": null
        },
        "temporalExtent": null
      },
      "downloadEnabled": true,
      "drawOrder": 0,
      "ecwpEnabled": false,
      "ecwpLayerName": "GEOPROCESSING/demo/demo_3_Band/IMAGINE.Portal_SDK_Painted_Relief-2017-10-18-22-30-29/TTI762FBP_BEA.img",
      "fileURI": "E:\\EAStorage\\storage\\wps\\isms\\process_output\\demo\\DTI7617MC_BEA\\TTI762FBP_BEA.img",
      "footprint": { // footprint geometry in EPSG:4326
        "cardinality": 2,
        "data": [
          [
            -84.5698212376335,
            34.174634992683,
            -84.372103017763,
            34.1751252459236,
            -84.3723480233361,
            34.2759779027836,
            -84.5703020322844,
            34.2754858012499
          ]
        ],
        "envelope": [
          -84.5703020322844,
          34.174634992683,
          -84.372103017763,
          34.2759779027836,
          "EPSG:4326"
        ],
        "epsgId": 4326,
        "srs": "EPSG:4326",
        "type": "polygon"
      },
      "geoServicesEnabled": false,
      "id": "01077a025f311d35015f32aeafeb0006",
      "identifier": "72e68b6b-e5a7-411d-9665-0ec44e43fde6",
      "imageXEnabled": false,
      "jpipEnabled": false,
      "metadata": { // categorized collection of arbitrary metadata values
        "METADATA_URI": {
          "ISO19115 Writer using templates": "E:\\EAStorage\\storage\\metadata\\coverage\\EAIM\\GEOPROCESSING\\demo\\demo_3_Band\\IMAGINE.Portal_SDK_Painted_Relief-2017-10-18-22-30-29\\TTI762FBP_BEA.xml"
        },
        "SPECIAL": {
          "username": "admin"
        }
      },
      "modificationDate": null,
      "name": "TTI762FBP_BEA",
      "nativeFootprint": { // footprint in dataset's native CRS
        "cardinality": 2,
        "data": [
          [
            2174650,
            1518850,
            2234450,
            1518850,
            2234450,
            1555550,
            2174650,
            1555550
          ]
        ],
        "envelope": [
          2174650,
          1518850,
          2234450,
          1555550,
          "EPSG:2240"
        ],
        "epsgId": 2240,
        "srs": "EPSG:2240",
        "type": "polygon"
      },
      "ogcUniqueName": "TTI762FBP_BEA", // layer name for OGC services (i.e. name made unique if there are duplicates)
      "parent": { // parent reference
        "defaultAttachmentName": "default",
        "id": "01077a025f311d35015f32aeae740000",
        "identifier": "06ee00b6-36d5-423f-96bf-6e98a7cfe7d2",
        "name": "IMAGINE.Portal_SDK_Painted_Relief-2017-10-18-22-30-29",
        "parentId": "01077a02585040f5015853a209de0006",
        "title": null
      },
      "path": "GEOPROCESSING/demo/demo_3_Band/IMAGINE.Portal_SDK_Painted_Relief-2017-10-18-22-30-29/TTI762FBP_BEA",
      "properties": { // arbitrary collection of property values
        "apollo.connector": "com.erdas.apollo.hedm.connector.ImageryConnector"
      },
      "pyramidDescriptor": { // data on pyramids/overviews
        "aggregatePyramid": false,
        "decimationFactor": 2.0067114093959733,
        "internal": true,
        "levelCount": 3,
        "levelDescriptors": [
          {
            "index": 1,
            "sizes": {
              "height": 183,
              "width": 298
            }
          },
          {
            "index": 2,
            "sizes": {
              "height": 92,
              "width": 149
            }
          },
          {
            "index": 3,
            "sizes": {
              "height": 46,
              "width": 75
            }
          }
        ],
        "sizes": {
          "height": 367,
          "width": 598
        },
        "upToDate": false
      },
      "rangeSetDescription": {
        "rangeSetSequence": [
          {
            "_class": "com.ionicsoft.coverage.RangeSet",
            "abstract": null,
            "iD": null,
            "name": "Range Set",
            "nameOrID": "Range Set",
            "namespace": null,
            "rangeAxisList": [
              {
                "_class": "com.ionicsoft.coverage.RangeAxis",
                "abstract": null,
                "channelRange": true,
                "name": "Band",
                "namespace": null,
                "nullValue": false,
                "rangeExtent": [
                  {
                    "continuousRange": true,
                    "maximum": {
                      "string": "band1",
                      "typeName": "String"
                    },
                    "minimum": {
                      "string": "band1",
                      "typeName": "String"
                    },
                    "resolution": {
                      "string": "",
                      "typeName": "String"
                    },
                    "singleValue": true,
                    "size": 1
                  },
                  {
                    "continuousRange": true,
                    "maximum": {
                      "string": "band2",
                      "typeName": "String"
                    },
                    "minimum": {
                      "string": "band2",
                      "typeName": "String"
                    },
                    "resolution": {
                      "string": "",
                      "typeName": "String"
                    },
                    "singleValue": true,
                    "size": 1
                  },
                  {
                    "continuousRange": true,
                    "maximum": {
                      "string": "band3",
                      "typeName": "String"
                    },
                    "minimum": {
                      "string": "band3",
                      "typeName": "String"
                    },
                    "resolution": {
                      "string": "",
                      "typeName": "String"
                    },
                    "singleValue": true,
                    "size": 1
                  }
                ],
                "title": "Band Selection, 3 Band(s)"
              },
              {
                "_class": "com.ionicsoft.coverage.RangeAxis",
                "abstract": null,
                "channelRange": false,
                "name": "Null Values",
                "namespace": null,
                "nullValue": true,
                "rangeExtent": [
                  {
                    "continuousRange": true,
                    "maximum": {
                      "string": "0.0",
                      "typeName": "double"
                    },
                    "minimum": {
                      "string": "0.0",
                      "typeName": "double"
                    },
                    "resolution": {
                      "string": "0.0",
                      "typeName": "double"
                    },
                    "singleValue": true,
                    "size": 1
                  }
                ],
                "title": null
              }
            ],
            "title": "Range Set Description"
          }
        ]
      },
      "registrationDate": "2017-10-19T03:30:29Z",
      "spatialExtentXPixelSize": 598,
      "spatialExtentYPixelSize": 367,
      "spatialExtentZPixelSize": null,
      "tags": [ // simple tags/keywords
        "GeoProcessed",
        "IMAGINE SMS:IMAGINE.Portal_SDK_Painted_Relief",
        "demo_3_Band",
        "Painted Relief"
      ],
      "temporalExtentEndDate": null,
      "temporalExtentStartDate": null,
      "title": "Painted Relief (TTI762FBP_BEA)",
      "viewEnabled": true,
      "wcsEnabled": true,
      "wmsEnabled": true,
      "wmtsEnabled": false,
      "wmtsLayerName": "TTI762FBP_BEA"
    }
```
Further descriptions of some of the more common properties:

| element | type | description | 
|-------------------|--------|---------------------------------------------------------------------------------------------| 
| acquisitionInfo | object | Various data about the acquisition of the dataset | 
| attachments | array  | Related files/data about the dataset (metadata files, thumbnails, etc.) | 
| children | array  | Array of children of this entity. Usually only folders/aggregates have children, but multi-image datasets can also have children| 
| domainSetExtent | object | Detailed information about the spatio-temporal extent of the dataset - 3D, temporal, elevation, etc. | 
| fileURI | string | File path to the dataset - can sometimes be a custom URI specifying another source of data (i.e. database)| 
| footprint | object | Footprint geometry in EPSG:4326  | 
| id | string | Identifier  | 
| metadata | array  | Categorized array of arbitrary metadata values. Some of this will be populated from external metadata (ISO files etc.)| 
| name | string | Dataset name | 
| nativeFootprint | object | Footprint geometry in dataset's native CRS | 
| ogcUniqueName | string | Dataset's unique layer name for OGC services (essentially name made unique if duplicates) | 
| parent | object | Parent reference | 
| properties | array | Array of arbitrary properties about the data. These are typed properties (in the database), which allows more efficient querying capabilities | 
| pyramidDescriptor  | object | Description of dataset pyramids/overviews | 
| rangeSetDescription | object | Essentially band information |
| registrationDate | date | Date the dataset was added to the catalog |
| tags | array | Array of tags/keywords |
| temporalExtentStartDate | date | Start of temporal range |
| temporalExtentEndDate | object | End of temporal range |
| title | object | Human-friendly dataset title |
