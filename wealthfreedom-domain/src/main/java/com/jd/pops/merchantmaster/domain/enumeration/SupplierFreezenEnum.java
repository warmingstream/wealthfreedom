package com.jd.pops.merchantmaster.domain.enumeration;

import java.util.ArrayList;
import java.util.List;

public enum SupplierFreezenEnum {

	DONGJIE(1, "冻结"),
	JIEDONG(0, "解冻");
	
	private Integer id;
	private String name;
	
	private SupplierFreezenEnum(Integer id, String name) {
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
	
	public static List<SupplierFreezenEnum> getAllType(){
        List<SupplierFreezenEnum> list =  new ArrayList<SupplierFreezenEnum>();
        SupplierFreezenEnum[] wArray =  SupplierFreezenEnum.values();
        for(SupplierFreezenEnum w : wArray){
            list.add(w);
        }
        return list;
    }
	
	public static String getTypeName(Integer key){
        for(SupplierFreezenEnum typeEnum : SupplierFreezenEnum.values()){
            if(typeEnum.getId().equals(key)){
				return typeEnum.getName();
            }
        }
        return null;
    }
}
