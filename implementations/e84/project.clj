(defproject e84-api-impl "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [ring "1.3.2"]
                 [ring/ring-json "0.4.0"]
                 [compojure "1.5.1"]
                 [com.stuartsierra/component "0.3.1"]
                 [clj-time "0.12.2"]
                 [com.rpl/specter "0.13.1"]
                 [clj-http "2.3.0"]]

  :profiles {:dev {:source-paths ["src" "dev" "test"]
                   :dependencies [[proto-repl "0.3.1"]]}
             :uberjar {:main e84-api-impl.main
                       :aot :all}})
