package com.jd.pops.merchantmaster.domain.enumeration;

import java.util.ArrayList;
import java.util.List;

public enum YnEnum {
	
	valid(1, "有效"), 
	invalid(0, "无效");

	private Integer id;
	private String name;

	private YnEnum(Integer id, String name) {
		this.id = id;
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}
	
	public static List<YnEnum> getAllType(){
        List<YnEnum> list =  new ArrayList<YnEnum>();
        YnEnum[] wArray =  YnEnum.values();
        for(YnEnum w : wArray){
            list.add(w);
        }
        return list;
    }
	
	public static String getTypeName(Integer key){
        for(YnEnum typeEnum : YnEnum.values()){
            if(typeEnum.getId().equals(key)){
                return typeEnum.getName();
            }
        }
        return null;
    }
}
