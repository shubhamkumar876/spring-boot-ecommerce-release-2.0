package com.sth876.ecommerce.config;

import com.sth876.ecommerce.entity.Country;
import com.sth876.ecommerce.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.sth876.ecommerce.entity.ProductCategory;
import com.sth876.ecommerce.entity.Product;

@Configuration
public class MydataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public MydataRestConfig(EntityManager theEntityManager){
        entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {

        HttpMethod[] theUnSupportedActions = {HttpMethod.PUT,HttpMethod.POST,HttpMethod.DELETE};

        //disable HTTP methods for product: PUT, POST and DELETE
        disableHttpMethods(Product.class,config, theUnSupportedActions);

        //disable HTTP methods for ProductCategory: PUT, POST and DELETE
        disableHttpMethods(ProductCategory.class,config, theUnSupportedActions);

        //disable HTTP methods for Country: PUT, POST and DELETE
        disableHttpMethods(Country.class,config, theUnSupportedActions);

        //disable HTTP methods for State: PUT, POST and DELETE
        disableHttpMethods(State.class,config, theUnSupportedActions);

        //call an internal helper method to expose the id's
        exposeIds(config);
    }

    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnSupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions));
    }

    private  void exposeIds(RepositoryRestConfiguration config){

        //expose entity ids
        //

        // - get a list of all entity classes from the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // - create an array of the entity types
        List<Class> entityClasses = new ArrayList<>();

        // - get the entity types for the entities
        for (EntityType temp : entities){
            entityClasses.add(temp.getJavaType());
        }

        // - expose the entity ids for the array of entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);

    }
}
