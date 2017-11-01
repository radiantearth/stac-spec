(ns e84-api-impl.search-service
  (:require
   [clojure.string :as str]
   [e84-api-impl.cmr-api :as cmr]
   [ring.util.codec :as codec]))

(defmulti item->geometry
  (fn [{:keys [polygons boxes] :as item}]
    (cond
      polygons :polygons
      boxes :boxes
      :else (throw (Exception. (str "Unknown geometry " (pr-str item)))))))

(defn coord-string->points
  [coord-str]
  (partition-all 2 (map #(Double. ^String %) (str/split coord-str #" "))))

(defn cmr-polygon->geojson-polygon
  [polygon]
  (map coord-string->points polygon))

(defmethod item->geometry :polygons
  [{:keys [polygons]}]
  {:type :Polygon
   ;; TODO May not be converting it correctly. Need to know if CMR style is equivalent to geojson
   :coordinates (cmr-polygon->geojson-polygon (first polygons))})

(defmethod item->geometry :boxes
  [{:keys [boxes]}]
  (let [[s w n e] (map #(Double. ^String %) (str/split (first boxes) #" "))]
   {:type :Polygon
    ;; Note this polygon doesn't contain the same area. It's going to curve
    ;; incorrectly. TODO densify
    :coordinates [[[w s]
                   [e s]
                   [e n]
                   [w n]
                   [w s]]]
    :bbox [w s e n]}))

(defmethod item->geometry :default
  [_]
  (item->geometry {:boxes ["-90 -180 90 180"]}))


(def link-data-type
  "http://esipfed.org/ns/fedsearch/1.1/data#")

(def link-browse-type
  "http://esipfed.org/ns/fedsearch/1.1/browse#")

(defn link-with-type
  [type links]
  (->> links
       (filter #(= (:rel %) type))
       first
       :href))

(defn feature-specific-links
  [params item-type item]
  (case item-type
    :collection
    {:granules (str "http://localhost:3000/features?"
                    (codec/form-encode
                     (assoc params :entry_title (:title item))))}
    :granule
    nil))

(defn item->feature
  [params item-type item]
  (let [{:keys [title links time_start time_end data_center]} item]
    {:type :Feature
     :id title
     :geometry (item->geometry item)
     :properties
     {:id title
      :start_date time_start
      :end_date time_end
      :provider data_center
      :links (merge
              (feature-specific-links params item-type item)
              {:thumbnail (link-with-type link-browse-type links)
               :data (link-with-type link-data-type links)
               :self (str "http://localhost:3000/features/"
                          (codec/url-encode title))})}}))



(def common-api-param-name->cmr-param-name
  {:limit :page_size
   :bbox :bounding_box
   :time :temporal
   :next :page_num})

(def granule-api-param-name->cmr-param-name
  (merge common-api-param-name->cmr-param-name
         {:id :granule_ur}))

(def collection-api-param-name->cmr-param-name
  (merge common-api-param-name->cmr-param-name
         {:id :entry_title}))

(defn api-param->cmr-param
  [item-type param-name value]
  (let [f (case item-type
            :granule granule-api-param-name->cmr-param-name
            :collection collection-api-param-name->cmr-param-name)]
    [(f param-name param-name) value]))

(defn find-features
  [item-type params]
  (let [items (cmr/find-items
               item-type
               (into {}
                     (map #(apply api-param->cmr-param item-type %)
                          params)))
        page_num (Long. ^String (:next params "1"))
        next-params (when (seq items)
                      (assoc params :next (inc page_num)))]
    (merge
     {:type :FeatureCollection
      :features (map #(item->feature params item-type %) items)}
     (when next-params
       {:next (str "http://localhost:3000/features?"
                   (codec/form-encode next-params))}))))

(defn get-feature
  [id]
  (-> (find-features {:id id})
      :features
      first))

#_
(def granules (cmr/find-granules nil))
#_
(def granule (first granules))
