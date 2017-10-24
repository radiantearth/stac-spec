(ns e84-api-impl.cmr-api
  (:require
   [clj-http.client :as http]
   [cheshire.core :as json]))

(def short-name
  "Landsat_8_OLI_TIRS")

(def version
  "1")

(def item-type->prov-params
  {:granule {:provider "USGS_EROS"
             :sort_key "granule_ur"}
   :collection {:provider "USGS_EROS"
                :has_granules true
                :sort_key "entry_title"}})


(def default-params
  {})

(defn find-items
  [item-type params]
  (let [query-params (merge default-params
                            params
                            (item-type->prov-params item-type))
        _ (println "Searching for" (name item-type)
                   "with" (pr-str query-params))
        resp (http/get
              (format "https://cmr.earthdata.nasa.gov/search/%ss.json"
                      (name item-type))
              {:query-params query-params})
        {:keys [body]} resp
        results (json/decode body true)]
    (get-in results [:feed :entry])))
