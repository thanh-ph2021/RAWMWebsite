/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.configs;

/**
 *
 * @author ASUS
 */

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.view.UrlBasedViewResolver;
import org.springframework.web.servlet.view.tiles3.TilesConfigurer;
import org.springframework.web.servlet.view.tiles3.TilesView;

@Configuration
public class TilesConfig {
    @Bean
    public UrlBasedViewResolver getUrlBasedViewResolver() {
        UrlBasedViewResolver resolver = new UrlBasedViewResolver();
        resolver.setViewClass(TilesView.class);
        resolver.setOrder(2);
        
        return resolver;
    }
    
    @Bean
    public TilesConfigurer tilesConfigurer() {
        TilesConfigurer conf = new TilesConfigurer();
        conf.setDefinitions("/WEB-INF/tiles.xml");
        
        return conf;
    }
}
