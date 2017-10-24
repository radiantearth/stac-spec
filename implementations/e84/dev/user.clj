(ns user
  (require [clojure.tools.namespace.repl :as tnr]
           [clojure.repl :refer :all]
           [proto-repl.saved-values]
           [com.stuartsierra.component :as c]
           [e84-api-impl.system :as s]))

(def system nil)

(defn start []
  (set! *print-length* 5000)
  (let [the-system (s/create-system)]
    (alter-var-root #'system
                    (constantly (c/start the-system))))
  nil)

(defn stop []
  (alter-var-root #'system #(when % (c/stop %)))
  nil)

(defn reset []
  (stop)
  (tnr/refresh :after 'user/start))

(println "E84 API Impl user.clj loaded")
