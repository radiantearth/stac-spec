(ns e84-api-impl.api.routes
  (:require
   [compojure.route :as route]
   [compojure.core :refer :all]
   [e84-api-impl.search-service :as search-service]
   [com.rpl.specter :as s]
   [cheshire.core :as json]))

(defmulti parse-resp
  "Handles converting a business api response into a ring response. Business api response should be
  a map containing at least a :status key. The other contents of the map will be different depending
  on the status"
  (fn [{:keys [status]}]
    status))

(defmethod parse-resp :invalid
  [{:keys [errors]}]
  {:status 400
   :content-type :json
   :body errors})

(defmethod parse-resp :not-found
  [{:keys [errors]}]
  {:status 404
   :content-type :json
   :body errors})

(defmethod parse-resp :ok
  [{:keys [content]}]
  {:status 200
   :content-type :json
   :body content})

(defmethod parse-resp :created
  [{:keys [content]}]
  {:status 201
   :content-type :json
   :body content})

(defn define-routes
  [app]
  (routes
   ;; TODO implement /api
   (context "/collections" []
     (GET "/" request
       {:status 200
        :body (json/encode (search-service/find-features
                            :collection (:params request))
                           {:pretty true})}))
   (context "/features" []
     (GET "/" request
       {:status 200
        :body (json/encode (search-service/find-features
                            :granule (:params request))
                           {:pretty true})})
     ;; TODO implement POST
     (POST "/" request
       {:status 200 :body "OK"})
     (context "/:id" [id]
       (GET "/" request
         {:status 200
          :body (json/encode (search-service/get-feature id)
                             {:pretty true})})))
   (route/not-found "Not Found")))
