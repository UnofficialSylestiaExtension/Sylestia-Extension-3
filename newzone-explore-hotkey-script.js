(() => {
   /* Adds a few lines in the pre-existing chooseabilityviakey1 function
    * to add proper selecting of targets for abilities that target allies.
    * See lines 132 and 133.
    */

   function selectAllyTarget(n) {
      // check to make sure there is a pet in the party and it is conscious
      if (document.getElementById("playerpet" + n) ) {
         selected_target[selected_pet] = String(n);
         checkendturn();
      }
   }

   // modify the existing function to allow hotkey targetting of ally pets
   // for ally-targetting actions
   chooseabilityviakey1 = function chooseabilityviakey1(e)
	{
      /* SYLESTIA CODE */
		if(lock_hotkeys == 0)
			{
				var evtobj = window.event? event : e
				var unicode = evtobj.charCode? evtobj.charCode : evtobj.keyCode
				
				var battleid = document.getElementById("battleidval").value;
				var battleturn = document.getElementById("battleturnval").value;
				var storyevent = document.getElementById("storyeventval").value;
				var randomevent = document.getElementById("randomeventval").value;
				var bossevent = document.getElementById("bosseventval").value;
				
				var button_close = document.getElementById("button_close");
				
				if(battleid > 0 && battleturn == 0)
					{
						//BEGIN BATTLE (b, B)
						if(unicode == 98 || unicode == 66)
							{
								parsecommand(2,2);
							}
						//RUN AWAY (r, R)
						else if(unicode == 114 || unicode == 82)
							{
								parsecommand(2,3);
							}
					}
				else if(battleid > 0)
					{
						//CLOSE BUTTON (e, E)
						if(button_close && (unicode == 101 || unicode == 69))
							{
								button_close.click();
							}
						else if(selected_window == "attackdiv")
							{
								//SELECT ABILITY (1, 2, 3, 4, 5, t, T, f, F, m, M, b, B, s, S)
								if(unicode == 49 || unicode == 50 || unicode == 51 || unicode == 52 || unicode == 53 || unicode == 116 || unicode == 84 || unicode == 102 || unicode == 70 || unicode == 109 || unicode == 77 || unicode == 98 || unicode == 66 || unicode == 115 || unicode == 83)
									{
										var ability = document.getElementById(selected_window+"pet"+selected_pet+"hotkey"+unicode).value;
										selectability(selected_pet,ability);
									}
								//OPEN ATTACKS (a, A)
								else if(unicode == 97 || unicode == 65)
									{
										openwindow("attackdiv");
									}
								//OPEN MANAGE (q, Q)
								else if(unicode == 113 || unicode == 81)
									{
										openwindow("managediv");
									}
							}
						else if(selected_window == "managediv")
							{
								//SELECT MANAGE OPTION (1, 2, 3, 4, 5, 6)
								if(unicode == 49 || unicode == 50 || unicode == 51 || unicode == 52 || unicode == 53 || unicode == 54)
									{
										var action = document.getElementById(selected_window+"hotkey"+unicode).value;
										selectaction(action);
									}
								//OPEN ATTACKS (a, A)
								else if(unicode == 97 || unicode == 65)
									{
										openwindow("attackdiv");
									}
								//OPEN MANAGE (q, Q)
								else if(unicode == 113 || unicode == 81)
									{
										openwindow("managediv");
									}
								//CLOSE WINDOW (c, C)
								else if(unicode == 99 || unicode == 67)
									{
										for(i=1;i<=6;i++)
											{
												var element_1 = document.getElementById("actiondiv" + i);
												
												if(element_1)
													{
														if(element_1.style.display == "inline")
															{
																openwindow("managediv");
																break;
															}
													}
											}
									}
							}
						else
							{
								//CLOSE WINDOW (c, C)
								if(unicode == 99 || unicode == 67)
									{
										for(i=1;i<=6;i++)
											{
												var element_1 = document.getElementById("actiondiv" + i);
												
												if(element_1)
													{
														if(element_1.style.display == "inline")
															{
																openwindow("managediv");
																break;
															}
													}
											}
									}
								//SELECT TARGET
								else if(selected_ability[selected_pet] != "0" && (unicode == 49 || unicode == 50 || unicode == 51))
									{
                              /* END SYLESTIA CODE */
                              /* EXTENSION 3 CODE */
                              if (ability_target[selected_pet] == 2) { // targets ally
                                 selectAllyTarget(unicode - 48);
                              } else {
                              /* END EXTENSION 3 CODE */
                              /* RESUME SYLESTIA CODE */
                                 var enemy_num = 0;
                                 
                                 if(unicode == 49)
                                    {
                                       for(i=4;i<=6;i++)
                                          {
                                             var element_1 = document.getElementById("petwindowslot" + i);
                                             
                                             if(element_1)
                                                {
                                                   selecttarget(i);
                                                   break;
                                                }
                                          }
                                    }
                                 else if(unicode == 50)
                                    {
                                       enemy_num = 5;
                                    }
                                 else if(unicode == 51)
                                    {
                                       enemy_num = 6;
                                    }
                                 
                                 if(enemy_num > 0)
                                    {
                                       var element_1 = document.getElementById("petwindowslot" + enemy_num);
                                       
                                       if(element_1)
                                          {
                                             selecttarget(enemy_num);
                                          }
                                    }
                              }
									}
								//OPEN ATTACKS (a, A)
								else if(unicode == 97 || unicode == 65)
									{
										openwindow("attackdiv");
									}
								//OPEN MANAGE (q, Q)
								else if(unicode == 113 || unicode == 81)
									{
										openwindow("managediv");
									}
								//END TURN (e, E)
								else if(unicode == 101 || unicode == 69)
									{
										endbattleturn();
									}
								//RUN AWAY (r, R)
								else if(unicode == 114 || unicode == 82)
									{
										//RUN AWAY
									}
							}
					}
				else if(storyevent != "none" || randomevent != "none" || bossevent != "none")
					{
						//DETECT IF EVENT BUTTONS
						var element_1 = document.getElementById("eventbutton1");
						var element_2 = document.getElementById("eventbutton2");
						var element_3 = document.getElementById("eventbutton3");
						
						//CLOSE BUTTON (e, E)
						if(button_close && (unicode == 101 || unicode == 69))
							{
								button_close.click();
							}
						//EVENT BUTTON 1 (e, E)
						else if(element_1 && (unicode == 101 || unicode == 69))
							{
								element_1.click();
							}
						//EVENT BUTTON 2 (b, B)
						else if(element_2 && (unicode == 98 || unicode == 66))
							{
								element_2.click();
							}
						//EVENT BUTTON 3 (r, R)
						else if(element_3 && (unicode == 114 || unicode == 82))
							{
								element_3.click();
							}
						//INTERACT (e, E)
						else if(unicode == 101 || unicode == 69)
							{
								parsecommand(2,1);
							}
						//IGNORE (r, R)
						else if(unicode == 114 || unicode == 82)
							{
								parsecommand(2,4);
							}
					}
				else
					{
						//CLOSE BUTTON (e, E)
						if(button_close && (unicode == 101 || unicode == 69))
							{
								button_close.click();
							}
						//USE ITEM (u, U)
						else if(unicode == 117 || unicode == 85)
							{
								var element_1 = document.getElementById("explorediv7");
								
								if(element_1)
									{
										if(element_1.style.display == "inline")
											{
												useexploreitem();
											}
									}
							}
						//OPEN INVENTORY (i, I)
						else if(unicode == 105 || unicode == 73)
							{
								openexplorewindow(7);
							}
						//OPEN PARTY SWAP (p, P)
						else if(unicode == 112 || unicode == 80)
							{
								openexplorewindow(8);
							}
						//DUNGEON MAP (m, M)
						else if(unicode == 109 || unicode == 77)
							{
								openexplorewindow(6);
							}
						//MOVE UP (w, W)
						else if(unicode == 119 || unicode == 87)
							{
								if(buttonlist["movebutton1"] == 1)
									{
										parsecommand(1,1);
									}
							}
						//MOVE LEFT (a, A)
						else if(unicode == 97 || unicode == 65)
							{
								if(buttonlist["movebutton2"] == 1)
									{
										parsecommand(1,2);
									}
							}
						//MOVE RIGHT (d, D)
						else if(unicode == 100 || unicode == 68)
							{
								if(buttonlist["movebutton3"] == 1)
									{
										parsecommand(1,3);
									}
							}
						//MOVE DOWN (s, S)
						else if(unicode == 115 || unicode == 83)
							{
								if(buttonlist["movebutton4"] == 1)
									{
										parsecommand(1,4);
									}
							}
					}
				
				//alert(unicode);
			}
	}

   document.onkeypress = chooseabilityviakey1;
})();