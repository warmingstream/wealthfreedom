package com.wealthfreedom.pops.merchantmaster.domain.enumeration;

import java.util.ArrayList;
import java.util.List;

public enum BusinessDepartmentEnum {

	GOODS(0, "消费品事业部"),
	_3C(1, "3c事业部"),
	FAMILY_LIFE(2, "居家生活事业部"),
	HOUSE_ELECTRICAL(3, "家电事业部"),
	FRESH(4, "生鲜事业部"),
	CLOUTHS(5, "大服饰事业部");

	private Integer id;
	private String name;

	private BusinessDepartmentEnum(Integer id, String name) {
		this.id = id;
		this.name = name;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public static List<BusinessDepartmentEnum> getAllType(){
        List<BusinessDepartmentEnum> list =  new ArrayList<BusinessDepartmentEnum>();
        BusinessDepartmentEnum[] wArray =  BusinessDepartmentEnum.values();
        for(BusinessDepartmentEnum w : wArray){
            list.add(w);
        }
        return list;
    }
	
	public static String getTypeName(Integer key){
        for(BusinessDepartmentEnum typeEnum : BusinessDepartmentEnum.values()){
            if(typeEnum.getId().equals(key)){
				return typeEnum.getName();
            }
        }
        return null;
    }
}
