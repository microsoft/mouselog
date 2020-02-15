// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

package crawler

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/gocolly/colly"
	"github.com/microsoft/mouselog/util"
)

// Basic example:
// http://go-colly.org/docs/examples/basic/
func CrawlWebsite(url string) []string {
	res := []string{}

	domain := url
	if strings.HasPrefix(domain, "https://") {
		domain = domain[8:]
	}
	if strings.HasPrefix(domain, "http://") {
		domain = domain[7:]
	}

	regexStr := strings.ReplaceAll(url, ".", "\\.") + "$|(/en.*)|(/docs/en.*)"

	// Instantiate default collector
	c := colly.NewCollector(
		// Visit only domains: example.com
		colly.AllowedDomains(domain),
		// Visit only root url and urls which start with "e" or "h" on httpbin.org
		colly.URLFilters(
			regexp.MustCompile(regexStr),
		),
	)

	// On every a element which has href attribute call callback
	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		// Print link
		//fmt.Printf("Link found: %q -> %s\n", e.Text, link)
		// Visit link found on page
		// Only those links are visited which are in AllowedDomains
		c.Visit(e.Request.AbsoluteURL(link))
	})

	// Before making a request print "Visiting ..."
	c.OnRequest(func(r *colly.Request) {
		path := r.URL.Path
		if path == "" {
			path = "/"
		} else if len(path) > 1 && strings.HasSuffix(path, "/") {
			path = path[:len(path)-1]
		}

		fmt.Println("Visiting", path)
		res = append(res, path)
	})

	// Start scraping
	c.Visit(url)

	return util.UniqueStringSlice(res)
}
