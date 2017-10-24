(ns e84-api-impl.api.jetty-server
 (:require [ring.middleware.json :as ring-json]
           [com.stuartsierra.component :as c]
           [compojure.handler :as handler]
           [ring.adapter.jetty :as jetty]))

(defn exception-handler
  [f]
  (fn [request]
    (try
      (f request)
      (catch Throwable t
        (.printStackTrace t)
        {:status 500
         :content-type :json
         :body "[\"An internal error occurred\"]"}))))

;; A Component that represents the API to a web application.
(defrecord JettyServer
  [
   ;; The port the application listens
   port

   ;; A functions that will create the routes. It should accept the app component as an argument
   ;; and return the routes
   routes-fn

   ;; The instance of the jetty server started and serving HTTP request
   jetty

   ;; The app component represents the a component that will contain all of the components needed
   ;; to service requests that were received.
   app]

  c/Lifecycle
  (start
    [api]
    (let [ring-handler (-> (routes-fn app) ;; Temporarily remove app argument for demo
                           ; (routes-fn)
                           ring-json/wrap-json-response
                           ring-json/wrap-json-params
                           exception-handler
                           handler/site)
          jetty (jetty/run-jetty ring-handler {:port port :join? false})]
      (println "Jetty running on port" port)
      (assoc api :jetty jetty)))

  (stop
    [api]
    (when jetty (.stop jetty))
    (dissoc api :jetty)))

(defn create-web-api
  "Creates an instance of the api component."
  [port routes-fn]
  (map->JettyServer {:port port :routes-fn routes-fn}))
