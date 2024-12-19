package main

import(
    "log"
    "net/http"
    "github.com/gorilla/websocket"
    "fmt"
)


func homePage(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Home Page")
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello World")
}

func setupRoutes() {
    http.HandleFunc("/", homePage)
    http.HandleFunc("/ws", wsEndpoint)
}

func main() {
    fmt.Println("Hello World")
    setupRoutes()
    log.Fatal(http.ListenAndServe(":8080", nil))
}

var upgrader = websocket.Upgrader{
    ReadBufferSize: 1024,
    WriteBufferSize: 1024,
}

func wsEndpoint(w *http.ResponseWriter, r *http.Request){
    upgrader.CheckOrigin = func(r * http.Request) bool {return true}

    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil{
        log.Println(err)
    }
    log.Println("Client connected")
    err = ws.WriteMessage(1, []byte,("Hi Client"))
    if err != nil {
        log.Prinln(err)
    }

    reader(ws)
}

func reader(conn *websocket.Conn){
    for {
        messageType, p, err := conn.ReadMessage()
        if err != nil{
            log.Println(err)
        }
        fmt.Println(string(p))
        if err := conn.WriteMessage(messageType, p) err != nil {
            log.Println(err)
            return
        }
    }
}

