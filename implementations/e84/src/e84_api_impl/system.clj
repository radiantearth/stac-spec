(ns e84-api-impl.system
  (require [com.stuartsierra.component :as c]
           [e84-api-impl.api.routes :as routes]
           [e84-api-impl.api.jetty-server :as jetty-server]))

(def PORT 3000)

(defn create-system
  "Creates a new instance of the message store system."
  []
  (c/system-map
    :api (c/using (jetty-server/create-web-api PORT routes/define-routes)
                  [:app])
    :app {}))
