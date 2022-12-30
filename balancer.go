package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"sync"
)

type Counter struct {
	mu    sync.Mutex
	count int
}

func (c *Counter) Add() {
	c.mu.Lock()
	if c.count == 4 {
		c.count = 1
	} else {
		c.count = c.count + 1
	}
	c.mu.Unlock()
}

func (c *Counter) Value() (x int) {
	c.mu.Lock()
	x = c.count
	c.mu.Unlock()
	return x
}

func findMinIndex(arr []int) int {
	min_index := 1
	for i := 1; i < len(arr); i++ {
		if arr[i] < arr[min_index] {
			min_index = i
		}
	}
	return min_index
}

func main() {
	mode := os.Getenv("MODE")

	current := Counter{count: 0}
	served := make([]int, 5)
	serving := make([]int, 5)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		var value int

		if mode == "rr" {
			current.Add()
			value = current.Value()
		} else if mode == "drr" {
			value = findMinIndex(serving)
		}

		served[value] += 1
		serving[value] += 1

		url := fmt.Sprintf("http://server_%v:300%v", value, value)
		resp, err := http.Get(url)
		if err != nil {
			log.Fatalln(err)
		}
		defer resp.Body.Close()

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Fatalln(err)
		}
		sb := string(body)

		fmt.Fprint(w, sb)
		serving[value] -= 1

		fmt.Println("Served:", served[1:], "Serving:", serving[1:])
	})

	port := fmt.Sprintf(":%v", os.Getenv("PORT"))
	fmt.Println("Load balancer running on http://localhost" + port + "...")
	log.Fatal(http.ListenAndServe(port, nil))
}
