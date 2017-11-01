(ns e84-api-impl.main
  (:require [e84-api-impl.system :as s]
            [com.stuartsierra.component :as c])
  (:gen-class))

(defn -main
  [& args]
  (let [s (s/create-system)]
    (c/start s)
    (println "Running api")))
