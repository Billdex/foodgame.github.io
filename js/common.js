function getRankInfo(recipe, chef) {

    var times = Number.MAX_VALUE;

    if (recipe.stirfry > 0) {
        times = Math.min(times, chef.stirfryVal / recipe.stirfry);
    }
    if (recipe.boil > 0) {
        times = Math.min(times, chef.boilVal / recipe.boil);
    }
    if (recipe.knife > 0) {
        times = Math.min(times, chef.knifeVal / recipe.knife);
    }
    if (recipe.fry > 0) {
        times = Math.min(times, chef.fryVal / recipe.fry);
    }
    if (recipe.bake > 0) {
        times = Math.min(times, chef.bakeVal / recipe.bake);
    }
    if (recipe.steam > 0) {
        times = Math.min(times, chef.steamVal / recipe.steam);
    }

    var rankInfo = {};

    var rankAddition = 0;
    var rankDisp = "-";
    var rankVal = 0;

    if (times != Number.MAX_VALUE) {
        if (times >= 5) {
            rankAddition = 100;
            rankDisp = "传";
            rankVal = 5;
        } else if (times >= 4) {
            rankAddition = 50;
            rankDisp = "神";
            rankVal = 4;
        } else if (times >= 3) {
            rankAddition = 30;
            rankDisp = "特";
            rankVal = 3;
        } else if (times >= 2) {
            rankAddition = 10;
            rankDisp = "优";
            rankVal = 2;
        } else if (times >= 1) {
            rankAddition = 0;
            rankDisp = "可";
            rankVal = 1;
        }
    }

    rankInfo["rankAddition"] = rankAddition;
    rankInfo["rankDisp"] = rankDisp;
    rankInfo["rankVal"] = rankVal;

    return rankInfo;
}

function getRecipeSkillAddition(effects, recipe, rule, checkCondition) {
    var addition = 0;
    var count = 1;
    for (var k in effects) {
        if (checkCondition && effects[k].conditionType) {
            if (effects[k].conditionMatch) {
                count = effects[k].conditionMatch;
            } else {
                continue;
            }
        }

        var type = effects[k].type;
        var hasSkill = false;
        if (type == "UseAll") {
            if (recipe.rarity == effects[k].rarity) {
                hasSkill = true;
            }
        } else if (type == "UseFish") {
            for (var m in recipe.materials) {
                if (recipe.materials[m].origin == "池塘") {
                    hasSkill = true;
                    break;
                }
            }
        } else if (type == "UseCreation") {
            for (var m in recipe.materials) {
                if (recipe.materials[m].origin == "作坊") {
                    hasSkill = true;
                    break;
                }
            }
        } else if (type == "UseMeat") {
            for (var m in recipe.materials) {
                if (recipe.materials[m].origin == "牧场"
                    || recipe.materials[m].origin == "鸡舍"
                    || recipe.materials[m].origin == "猪圈") {
                    hasSkill = true;
                    break;
                }
            }
        } else if (type == "UseVegetable") {
            for (var m in recipe.materials) {
                if (recipe.materials[m].origin == "菜棚"
                    || recipe.materials[m].origin == "菜地"
                    || recipe.materials[m].origin == "森林") {
                    hasSkill = true;
                    break;
                }
            }
        } else if (type == "UseStirfry") {
            if (recipe.stirfry > 0) {
                hasSkill = true;
            }
        } else if (type == "UseBoil") {
            if (recipe.boil > 0) {
                hasSkill = true;
            }
        } else if (type == "UseFry") {
            if (recipe.fry > 0) {
                hasSkill = true;
            }
        } else if (type == "UseKnife") {
            if (recipe.knife > 0) {
                hasSkill = true;
            }
        } else if (type == "UseBake") {
            if (recipe.bake > 0) {
                hasSkill = true;
            }
        } else if (type == "UseSteam") {
            if (recipe.steam > 0) {
                hasSkill = true;
            }
        } else if (type == "UseSweet") {
            if (recipe.condiment == "Sweet") {
                hasSkill = true;
            }
        } else if (type == "UseSour") {
            if (recipe.condiment == "Sour") {
                hasSkill = true;
            }
        } else if (type == "UseSpicy") {
            if (recipe.condiment == "Spicy") {
                hasSkill = true;
            }
        } else if (type == "UseSalty") {
            if (recipe.condiment == "Salty") {
                hasSkill = true;
            }
        } else if (type == "UseBitter") {
            if (recipe.condiment == "Bitter") {
                hasSkill = true;
            }
        } else if (type == "UseTasty") {
            if (recipe.condiment == "Tasty") {
                hasSkill = true;
            }
        } else if (type == "Gold_Gain") {
            if (!rule || rule.Id == 0) {
                hasSkill = true;
            }
        } else if (type == "CookbookPrice") {
            hasSkill = true;
        }

        if (hasSkill) {
            addition += effects[k].value * count;
        }
    }
    return +addition.toFixed(2);
}

function getRecipeBasicAddition(effects) {
    var addition = 0;
    var count = 1;
    for (var k in effects) {
        if (effects[k].type == "BasicPrice") {
            if (effects[k].conditionType) {
                if (effects[k].conditionMatch) {
                    count = effects[k].conditionMatch;
                } else {
                    continue;
                }
            }
            addition += effects[k].value * count;
        }
    }
    return +addition.toFixed(2);
}

function updateConditionMatch(effects, chef, recipe, num, recipes) {
    for (var k in effects) {
        var effect = effects[k];
        if (!effect.conditionType) {
            continue;
        }
        effect["conditionMatch"] = 0;
        if (effect.conditionType == "PerRank") {
            for (var i in recipes) {
                var recipe = recipes[i].data;
                if (recipe) {
                    var rankData = getRankInfo(recipe, chef);
                    if (rankData.rankVal >= effect.conditionValue) {
                        effect.conditionMatch += 1;
                    }
                }
            }
        } else if (effect.conditionType == "ExcessCookbookNum") {
            if (num >= effect.conditionValue) {
                effect.conditionMatch = 1;
            }
        } else if (effect.conditionType == "SameSkill") {
            var sameCount = 0;
            var count1 = 0;
            var count2 = 0;
            var count3 = 0;
            var count4 = 0;
            var count5 = 0;
            var count6 = 0;
            for (var i in recipes) {
                var recipe = recipes[i].data;
                if (!recipe) {
                    return;
                }

                if (recipe.stirfry > 0) {
                    count1++;
                    if (count1 == 3) {
                        sameCount++;
                    }
                }
                if (recipe.boil > 0) {
                    count2++;
                    if (count2 == 3) {
                        sameCount++;
                    }
                }
                if (recipe.knife > 0) {
                    count3++;
                    if (count3 == 3) {
                        sameCount++;
                    }
                }
                if (recipe.fry > 0) {
                    count4++;
                    if (count4 == 3) {
                        sameCount++;
                    }
                }
                if (recipe.bake > 0) {
                    count5++;
                    if (count5 == 3) {
                        sameCount++;
                    }
                }
                if (recipe.steam > 0) {
                    count6++;
                    if (count6 == 3) {
                        sameCount++;
                    }
                }
            }

            effect.conditionMatch = sameCount;
        }
    }
}

function getMaterialsAddition(recipe, materials) {
    var addition = 0;

    for (var m in recipe.materials) {
        for (var n in materials) {
            if (recipe.materials[m].material == materials[n].materialId) {
                if (materials[n].addition) {
                    addition += Number(materials[n].addition);
                    break;
                }
            }
        }
    }
    return +addition.toFixed(2);
}

function buildRecipeMenu(recipe) {
    var result = [];
    var item = {};
    item["data"] = recipe;
    result.push(item);
    return result;
}

function getPercentDisp(percent) {
    if (percent != 0) {
        return percent.toString() + "%";
    } else {
        return "";
    }
}

function getRecipeQuantity(recipe, materials, rule) {
    var quantity = 1;
    if (!rule.hasOwnProperty("DisableMultiCookbook") || rule.DisableMultiCookbook == false) {
        quantity = recipe.limitVal;
    }

    for (var m in recipe.materials) {
        var exist = false;
        for (var n in materials) {
            if (recipe.materials[m].material == materials[n].materialId) {
                exist = true;
                if (materials[n].quantity) {
                    var tt = Math.floor(materials[n].quantity / recipe.materials[m].quantity);
                    if (tt < quantity) {
                        quantity = tt;
                    }
                    break;
                } else if (materials[n].quantity === 0) {
                    return 0;
                }
            }
        }
        if (!exist) {
            return 0;
        }
    }

    if (quantity < 0) {
        return 0;
    }

    return quantity;
}

function getRecipeResult(chef, equip, recipe, quantity, maxQuantity, materials, rule, decoration, condiment, forCal, recipes, partialUltimateData) {

    var resultData = {};

    var rankAddition = 0;
    var chefSkillAddition = 0;
    var equipSkillAddition = 0;
    var decorationAddition = 0;
    var bonusAddition = 0;
    var condimentSkillAddition = 0;

    var basicAddition = 0;
    var partialAddition = 0;

    if (chef && chef.chefId) {
        var rankData = getRankInfo(recipe, chef);
        resultData["rankVal"] = rankData.rankVal;
        resultData["rankDisp"] = rankData.rankDisp;

        if (!forCal && rankData.rankVal == 0) {
            return resultData;
        }

        if (!rule || !rule.hasOwnProperty("DisableCookbookRank") || rule.DisableCookbookRank == false) {
            rankAddition = rankData.rankAddition;
        }

        resultData["rankAdditionDisp"] = getPercentDisp(rankAddition);

        if (!rule || !rule.hasOwnProperty("DisableChefSkillEffect") || rule.DisableChefSkillEffect == false) {
            updateConditionMatch(chef.specialSkillEffect, chef, recipe, quantity, recipes);

            chefSkillAddition = getRecipeSkillAddition(chef.specialSkillEffect, recipe, rule, true);
            basicAddition = getRecipeBasicAddition(chef.specialSkillEffect);

            updateConditionMatch(chef.selfUltimateEffect, chef, recipe, quantity, recipes);
            chefSkillAddition += getRecipeSkillAddition(chef.selfUltimateEffect, recipe, rule, true);
            basicAddition += getRecipeBasicAddition(chef.selfUltimateEffect);

            if (partialUltimateData) {
                for (var m in partialUltimateData) {
                    partialAddition = getRecipeSkillAddition(partialUltimateData[m].effect, recipe, rule, true);
                    basicAddition += getRecipeBasicAddition(partialUltimateData[m].effect);
                }
            }
        }
        resultData["chefSkillAdditionDisp"] = getPercentDisp(chefSkillAddition);

        if (!rule || !rule.hasOwnProperty("DisableEquipSkillEffect") || rule.DisableEquipSkillEffect == false) {
            if (equip && equip.effect) {
                var equipEffect = updateEquipmentEffect(equip.effect, chef.selfUltimateEffect);
                updateConditionMatch(equipEffect, chef, recipe, quantity, recipes);
                equipSkillAddition = getRecipeSkillAddition(equipEffect, recipe, rule, true);
                basicAddition += getRecipeBasicAddition(equipEffect);
            }
        }
        resultData["equipSkillAdditionDisp"] = getPercentDisp(equipSkillAddition);

        bonusAddition = bonusAddition + Number(chef.addition);
    }

    resultData["partialAdditionDisp"] = getPercentDisp(partialAddition);
    resultData["basicAdditionDisp"] = getPercentDisp(basicAddition);

    if (!rule || !rule.hasOwnProperty("DisableCondimentEffect") || rule.DisableCondimentEffect == false) {
        if (condiment) {
            resultData["useCondiment"] = true;
            condimentSkillAddition = getRecipeSkillAddition(condiment.effect, recipe, rule, false);
        }
    }
    resultData["condimentSkillAdditionDisp"] = getPercentDisp(condimentSkillAddition);

    if (!rule || !rule.hasOwnProperty("DisableDecorationEffect") || rule.DisableDecorationEffect == false) {
        if (decoration) {
            decorationAddition = decoration;
        }
    }
    resultData["decorationAdditionDisp"] = getPercentDisp(decorationAddition);

    bonusAddition = bonusAddition + Number(recipe.addition);

    if (rule && rule.hasOwnProperty("MaterialsEffect")) {
        var materialsAddition = getMaterialsAddition(recipe, materials);
        bonusAddition = bonusAddition + materialsAddition;
    }

    var priceAddition = (rankAddition + chefSkillAddition + equipSkillAddition + condimentSkillAddition + decorationAddition + recipe.ultimateAddition + partialAddition) / 100;
    var basicPrice = Math.floor(recipe.price * (1 + basicAddition / 100));

    resultData["data"] = recipe;
    resultData["quantity"] = quantity;
    resultData["max"] = maxQuantity;
    resultData["limit"] = quantity;
    resultData["bonusAdditionDisp"] = getPercentDisp(+(bonusAddition * 100).toFixed(2));
    resultData["totalPrice"] = recipe.price * quantity;
    resultData["realPrice"] = Math.ceil(+(basicPrice * (1 + priceAddition)).toFixed(2));
    var score = Math.ceil(+(basicPrice * (1 + priceAddition + bonusAddition)).toFixed(2));
    resultData["bonusScore"] = score - resultData.realPrice;
    resultData["totalBonusScore"] = resultData.bonusScore * quantity;
    resultData["score"] = score;
    resultData["totalScore"] = score * quantity;
    resultData["totalTime"] = recipe.time * quantity;
    resultData["totalTimeDisp"] = secondsToTime(resultData.totalTime);

    var efficiency = Math.floor(resultData.realPrice * 3600 / recipe.time);
    resultData["efficiency"] = efficiency;

    var chefEff = 0;
    if (chef && resultData.rankVal > 0) {
        chefEff = efficiency;
    }
    resultData["chefEff"] = chefEff;

    return resultData;
}

function calAddition(value, addition) {
    return +((value + addition.abs) * (1 + addition.percent / 100)).toFixed(2);
}

function getTimeAddition(effects) {
    var addition = 0;
    for (var k in effects) {
        if (effects[k].type == "OpenTime") {
            addition += effects[k].value;
        }
    }
    return +addition.toFixed(2);
}

function updateEquipmentEffect(effect, selfUltimateEffect) {
    var result = effect;
    for (var i in selfUltimateEffect) {
        if (selfUltimateEffect[i].type == "MutiEquipmentSkill") {
            result = JSON.parse(JSON.stringify(effect));
            for (var j in result) {
                var equipAddtion = new Addition();
                setAddition(equipAddtion, selfUltimateEffect[i]);
                result[j].value = calAddition(result[j].value, equipAddtion);
            }
        }
    }
    return result;
}

function setAddition(addition, effect) {
    if (effect.cal == "Abs") {
        addition.abs = +(addition.abs + effect.value).toFixed(2);
    } else if (effect.cal == "Percent") {
        addition.percent = +(addition.percent + effect.value).toFixed(2);
    }
}

function Addition() {
    this.abs = 0;
    this.percent = 0;
}

function secondsToTime(sec) {
    sec = Number(sec);

    var d = Math.floor(sec / 3600 / 24);
    var h = Math.floor(sec / 3600 % 24);
    var m = Math.floor(sec / 60 % 60);
    var s = Math.floor(sec % 60);

    var ret = "";
    if (d > 0) {
        ret += d + "天";
    }
    if (h > 0) {
        ret += h + "小时";
    }
    if (m > 0) {
        ret += m + "分";
    }
    if (s > 0) {
        ret += s + "秒";
    }

    return ret;
}

function getEquipInfo(equipId, equips) {
    var info = null;
    if (equipId) {
        for (var j in equips) {
            if (equipId == equips[j].equipId) {
                return equips[j];
            }
        }
    }
    return info;
}

function getCondimentInfo(condimentId, condiments) {
    var info = null;
    if (condimentId) {
        for (var j in condiments) {
            if (condimentId == condiments[j].condimentId) {
                return condiments[j];
            }
        }
    }
    return info;
}

function setDataForChef(chef, equip, useEquip, globalUltimateEffect, selfPartialUltimateData, otherPartialUltimateData, selfUltimateEffect, activityUltimateEffect, showFinal, rule) {

    var stirfryAddition = new Addition();
    var boilAddition = new Addition();
    var knifeAddition = new Addition();
    var fryAddition = new Addition();
    var bakeAddition = new Addition();
    var steamAddition = new Addition();

    var meatAddition = 0;
    var creationAddition = 0;
    var vegAddition = 0;
    var fishAddition = 0;

    var sweetAddition = new Addition();
    var sourAddition = new Addition();
    var spicyAddition = new Addition();
    var saltyAddition = new Addition();
    var bitterAddition = new Addition();
    var tastyAddition = new Addition();

    var effects = [];

    chef["selfUltimateEffect"] = [];

    if (!rule || !rule.hasOwnProperty("DisableChefSkillEffect") || rule.DisableChefSkillEffect == false) {
        effects = effects.concat(chef.specialSkillEffect);
        effects = effects.concat(globalUltimateEffect);

        if (selfUltimateEffect) {
            for (var i in selfUltimateEffect) {
                if (chef.chefId == selfUltimateEffect[i].chefId) {
                    chef.selfUltimateEffect = selfUltimateEffect[i].effect;
                    effects = effects.concat(selfUltimateEffect[i].effect);
                    break;
                }
            }
        }

        var selfPartialAdded = false;
        if (selfPartialUltimateData) {
            for (var i in selfPartialUltimateData) {
                if (chef.chefId == selfPartialUltimateData[i].chefId) {
                    effects = effects.concat(selfPartialUltimateData[i].effect);
                    selfPartialAdded = true;
                    break;
                }
            }
        }

        if (otherPartialUltimateData) {
            for (var i in otherPartialUltimateData) {
                if (chef.chefId == otherPartialUltimateData[i].chefId && selfPartialAdded) {
                    continue;
                }
                effects = effects.concat(otherPartialUltimateData[i].effect);
            }
        }
    }

    if (!rule || !rule.hasOwnProperty("DisableEquipSkillEffect") || rule.DisableEquipSkillEffect == false) {
        if (useEquip && equip && equip.effect) {
            var equipEffect = updateEquipmentEffect(equip.effect, chef.selfUltimateEffect);
            effects = effects.concat(equipEffect);
        }
    }

    if (activityUltimateEffect) {
        effects = effects.concat(activityUltimateEffect);
    }

    for (var i in effects) {
        var type = effects[i].type;
        var tag = effects[i].tag;

        if (tag && chef.tags.indexOf(tag) < 0) {
            continue;
        }

        if (type == "Stirfry") {
            setAddition(stirfryAddition, effects[i]);
        } else if (type == "Boil") {
            setAddition(boilAddition, effects[i]);
        } else if (type == "Knife") {
            setAddition(knifeAddition, effects[i]);
        } else if (type == "Fry") {
            setAddition(fryAddition, effects[i]);
        } else if (type == "Bake") {
            setAddition(bakeAddition, effects[i]);
        } else if (type == "Steam") {
            setAddition(steamAddition, effects[i]);
        } else if (type == "Meat") {
            meatAddition += effects[i].value;
        } else if (type == "Creation") {
            creationAddition += effects[i].value;
        } else if (type == "Vegetable") {
            vegAddition += effects[i].value;
        } else if (type == "Fish") {
            fishAddition += effects[i].value;
        } else if (type == "Sweet") {
            setAddition(sweetAddition, effects[i]);
        } else if (type == "Sour") {
            setAddition(sourAddition, effects[i]);
        } else if (type == "Spicy") {
            setAddition(spicyAddition, effects[i]);
        } else if (type == "Salty") {
            setAddition(saltyAddition, effects[i]);
        } else if (type == "Bitter") {
            setAddition(bitterAddition, effects[i]);
        } else if (type == "Tasty") {
            setAddition(tastyAddition, effects[i]);
        }
    }

    chef["meatVal"] = chef.meat + meatAddition;
    chef["creationVal"] = chef.creation + creationAddition;
    chef["vegVal"] = chef.veg + vegAddition;
    chef["fishVal"] = chef.fish + fishAddition;

    chef["meatDisp"] = getAtrributeDisp(chef.meatVal, chef.meat, showFinal);
    chef["creationDisp"] = getAtrributeDisp(chef.creationVal, chef.creation, showFinal);
    chef["vegDisp"] = getAtrributeDisp(chef.vegVal, chef.veg, showFinal);
    chef["fishDisp"] = getAtrributeDisp(chef.fishVal, chef.fish, showFinal);

    chef["stirfryVal"] = Math.ceil(calAddition(chef.stirfry, stirfryAddition));
    chef["boilVal"] = Math.ceil(calAddition(chef.boil, boilAddition));
    chef["knifeVal"] = Math.ceil(calAddition(chef.knife, knifeAddition));
    chef["fryVal"] = Math.ceil(calAddition(chef.fry, fryAddition));
    chef["bakeVal"] = Math.ceil(calAddition(chef.bake, bakeAddition));
    chef["steamVal"] = Math.ceil(calAddition(chef.steam, steamAddition));

    chef["stirfryDisp"] = getAtrributeDisp(chef.stirfryVal, chef.stirfry, showFinal);
    chef["boilDisp"] = getAtrributeDisp(chef.boilVal, chef.boil, showFinal);
    chef["knifeDisp"] = getAtrributeDisp(chef.knifeVal, chef.knife, showFinal);
    chef["fryDisp"] = getAtrributeDisp(chef.fryVal, chef.fry, showFinal);
    chef["bakeDisp"] = getAtrributeDisp(chef.bakeVal, chef.bake, showFinal);
    chef["steamDisp"] = getAtrributeDisp(chef.steamVal, chef.steam, showFinal);

    chef["sweetVal"] = Math.ceil(calAddition(chef.sweet, sweetAddition));
    chef["sourVal"] = Math.ceil(calAddition(chef.sour, sourAddition));
    chef["spicyVal"] = Math.ceil(calAddition(chef.spicy, spicyAddition));
    chef["saltyVal"] = Math.ceil(calAddition(chef.salty, saltyAddition));
    chef["bitterVal"] = Math.ceil(calAddition(chef.bitter, bitterAddition));
    chef["tastyVal"] = Math.ceil(calAddition(chef.tasty, tastyAddition));

    chef["sweetDisp"] = getAtrributeDisp(chef.sweetVal, chef.sweet, showFinal);
    chef["sourDisp"] = getAtrributeDisp(chef.sourVal, chef.sour, showFinal);
    chef["spicyDisp"] = getAtrributeDisp(chef.spicyVal, chef.spicy, showFinal);
    chef["saltyDisp"] = getAtrributeDisp(chef.saltyVal, chef.salty, showFinal);
    chef["bitterDisp"] = getAtrributeDisp(chef.bitterVal, chef.bitter, showFinal);
    chef["tastyDisp"] = getAtrributeDisp(chef.tastyVal, chef.tasty, showFinal);

    chef["disp"] = "<span class='name'>" + chef.name + "</span><br><small>";
    var count = 0;
    if (chef.stirfryDisp) {
        chef.disp += "炒" + chef.stirfryDisp + " ";
        count++;
    }
    if (chef.boilDisp) {
        chef.disp += "煮" + chef.boilDisp + " ";
        count++;
        if (count % 2 == 0) {
            chef.disp += "<br>";
        }
    }
    if (chef.knifeDisp) {
        chef.disp += "切" + chef.knifeDisp + " ";
        count++;
        if (count % 2 == 0) {
            chef.disp += "<br>";
        }
    }
    if (chef.fryDisp) {
        chef.disp += "炸" + chef.fryDisp + " ";
        count++;
        if (count % 2 == 0) {
            chef.disp += "<br>";
        }
    }
    if (chef.bakeDisp) {
        chef.disp += "烤" + chef.bakeDisp + " ";
        count++;
        if (count % 2 == 0) {
            chef.disp += "<br>";
        }
    }
    if (chef.steamDisp) {
        chef.disp += "蒸" + chef.steamDisp + " ";
    }
    chef.disp += "</small>"
}

function getAtrributeDisp(final, origin, showFinal) {
    var disp = "";
    if (showFinal) {
        if (final) {
            disp = final;
        }
        return disp;
    }
    if (origin) {
        disp += origin;
    }
    var add = final - origin;
    if (add) {
        if (add > 0) {
            disp += "+";
        }
        disp += add;
    }
    return disp;
}

function getRarityDisp(rarity) {
    var rarityDisp = "";
    for (var j = 0; j < rarity; j++) {
        rarityDisp += "&#x2605;";
    }
    return rarityDisp;
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function getPartialUltimateData(chefs, skills, useUltimate, ids) {
    var result = [];
    if (useUltimate) {
        for (var i in ids) {
            for (var j in chefs) {
                if (ids[i] == chefs[j].chefId) {
                    for (var k in skills) {
                        if (chefs[j].ultimateSkill == skills[k].skillId) {
                            var tempEffect = [];
                            for (var m in skills[k].effect) {
                                if (skills[k].effect[m].condition == "Partial") {
                                    tempEffect.push(skills[k].effect[m]);
                                }
                            }
                            if (tempEffect.length) {
                                var partialData = {};
                                partialData["chefId"] = chefs[j].chefId;
                                partialData["effect"] = tempEffect;
                                result.push(partialData);
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }
    return result;
}

function getSelfUltimateData(chefs, skills, useUltimate, ids) {
    var result = [];
    if (useUltimate) {
        for (var i in ids) {
            for (var j in chefs) {
                if (ids[i] == chefs[j].chefId) {
                    for (var k in skills) {
                        if (chefs[j].ultimateSkill == skills[k].skillId) {
                            var tempEffect = [];
                            for (var m in skills[k].effect) {
                                if (skills[k].effect[m].condition == "Self") {
                                    tempEffect.push(skills[k].effect[m]);
                                }
                            }
                            if (tempEffect.length) {
                                var selfData = {};
                                selfData["chefId"] = chefs[j].chefId;
                                selfData["effect"] = tempEffect;
                                result.push(selfData);
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }
    return result;
}

function updateMaterialsData(materialsData, recipe, quantity) {
    for (var m in recipe.data.materials) {
        for (var n in materialsData) {
            if (recipe.data.materials[m].material == materialsData[n].materialId) {
                if (Number.isInteger(parseInt(materialsData[n].quantity))) {
                    materialsData[n].quantity -= recipe.data.materials[m].quantity * quantity;
                }
            }
        }
    }
}

function getMaxNSum(recipesData, num) {
    recipesData.sort(function (a, b) {
        return b.totalScore - a.totalScore
    });
    var sum = 0;
    var toIndex = Math.min(recipesData.length, num);
    for (var m = 0; m < toIndex; m++) {
        sum += recipesData[m].totalScore;
    }
    return sum;
}

function getMaxNSumRecipes(combsData, data) {
    var allRecipes = [];
    for (var j in combsData) {
        for (var k in combsData[j].recipes) {
            allRecipes.push(combsData[j].recipes[k]);
        }
    }

    allRecipes.sort(function (a, b) {
        return b.totalScore - a.totalScore
    });

    var recipeArray = [];
    var recipeIdArray = [];
    var sum = 0;
    for (var m in allRecipes) {
        if (recipeIdArray.indexOf(allRecipes[m].recipeId) < 0) {
            recipeIdArray.push(allRecipes[m].recipeId);
            recipeArray.push(allRecipes[m]);

            if (recipeIdArray.length <= data.rule.RecipesNumLimit) {
                sum += allRecipes[m].totalScore;
            }

            if (recipeIdArray.length == data.rule.ChefNumLimit * data.rule.RecipesNumLimit) {
                break;
            }
        }
    }
    return { "recipes": recipeArray, "sum": sum };
}