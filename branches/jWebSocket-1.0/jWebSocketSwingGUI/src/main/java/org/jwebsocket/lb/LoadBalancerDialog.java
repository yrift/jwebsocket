//	---------------------------------------------------------------------------
//	jWebSocket Load Balancer Dialog (Community Edition, CE)
//	---------------------------------------------------------------------------
//	Copyright 2010-2014 Innotrade GmbH (jWebSocket.org)
//      Alexander Schulze, Germany (NRW)
//
//	Licensed under the Apache License, Version 2.0 (the "License");
//	you may not use this file except in compliance with the License.
//	You may obtain a copy of the License at
//
//	http://www.apache.org/licenses/LICENSE-2.0
//
//	Unless required by applicable law or agreed to in writing, software
//	distributed under the License is distributed on an "AS IS" BASIS,
//	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//	See the License for the specific language governing permissions and
//	limitations under the License.
//	---------------------------------------------------------------------------
package org.jwebsocket.lb;

import java.awt.Toolkit;
import java.util.List;
import java.util.Map;
import javolution.util.FastList;
import org.jwebsocket.api.WebSocketClientEvent;
import org.jwebsocket.api.WebSocketClientTokenListener;
import org.jwebsocket.api.WebSocketPacket;
import org.jwebsocket.client.token.BaseTokenClient;
import org.jwebsocket.kit.IsAlreadyConnectedException;
import org.jwebsocket.kit.WebSocketException;
import org.jwebsocket.token.Token;
import org.jwebsocket.token.TokenFactory;

/**
 *
 * @author rbetancourt
 */
public class LoadBalancerDialog extends javax.swing.JFrame {

	private BaseTokenClient mClient;
	private List<BaseTokenClient> mServices;
	private javax.swing.JTextArea txaLog;

	/**
	 * Creates new form LoadBalancerDialog
	 */
	public LoadBalancerDialog(BaseTokenClient aClient, javax.swing.JTextArea atxaLog) {
		initComponents();
		this.mClient = aClient;
		mServices = new FastList<BaseTokenClient>();
		this.txaLog = atxaLog;
	}

	private LoadBalancerDialog() {
		throw new UnsupportedOperationException("Not yet implemented");
	}

	/**
	 * This method is called from within the constructor to initialize the
	 * form. WARNING: Do NOT modify this code. The content of this method is
	 * always regenerated by the Form Editor.
	 */
	@SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jbMulXY = new javax.swing.JButton();
        jbSumXY = new javax.swing.JButton();
        cbY = new javax.swing.JComboBox();
        jLabel5 = new javax.swing.JLabel();
        cbX = new javax.swing.JComboBox();
        jLabel4 = new javax.swing.JLabel();
        jbEndPointsI = new javax.swing.JButton();
        jbStickyEP = new javax.swing.JButton();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        cbEndPointId = new javax.swing.JComboBox();
        jbShutdownEP = new javax.swing.JButton();
        jbDeregisterSE = new javax.swing.JButton();
        jbRegisterSE = new javax.swing.JButton();
        cbClusterAlias = new javax.swing.JComboBox();
        jLabel1 = new javax.swing.JLabel();
        jpPassword = new javax.swing.JPasswordField();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);
        setTitle("jWebSocket Load Balancer Demo");
        setIconImage(Toolkit.getDefaultToolkit().getImage(getClass().getResource("/images/Synapso16x16.png")));
        setName(""); // NOI18N

        jbMulXY.setLabel("Mul");
        jbMulXY.setPreferredSize(new java.awt.Dimension(60, 20));
        jbMulXY.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jbMulXYActionPerformed(evt);
            }
        });

        jbSumXY.setLabel("Sum");
        jbSumXY.setMaximumSize(new java.awt.Dimension(55, 23));
        jbSumXY.setMinimumSize(new java.awt.Dimension(55, 23));
        jbSumXY.setPreferredSize(new java.awt.Dimension(50, 20));
        jbSumXY.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jbSumXYActionPerformed(evt);
            }
        });

        cbY.setModel(new javax.swing.DefaultComboBoxModel(new String[] { "1", "2", "3", "4", "5", "6", "7", "8", "9", "10" }));
        cbY.setPreferredSize(new java.awt.Dimension(37, 18));

        jLabel5.setText("Y:");

        cbX.setModel(new javax.swing.DefaultComboBoxModel(new String[] { "1", "2", "3", "4", "5", "6", "7", "8", "9", "10" }));
        cbX.setPreferredSize(new java.awt.Dimension(37, 18));

        jLabel4.setText("X:");

        jbEndPointsI.setText("EndPoints Info");
        jbEndPointsI.setPreferredSize(new java.awt.Dimension(110, 20));
        jbEndPointsI.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jbEndPointsIActionPerformed(evt);
            }
        });

        jbStickyEP.setText("Sticky Routes");
        jbStickyEP.setPreferredSize(new java.awt.Dimension(110, 20));
        jbStickyEP.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jbStickyEPActionPerformed(evt);
            }
        });

        jLabel2.setText("Password:");

        jLabel3.setText("EndPoint Id:");
        jLabel3.setToolTipText("");

        cbEndPointId.setModel(new javax.swing.DefaultComboBoxModel(new String[] { "Item 1", "Item 2", "Item 3", "Item 4" }));
        cbEndPointId.setPreferredSize(new java.awt.Dimension(56, 18));
        cbEndPointId.addFocusListener(new java.awt.event.FocusAdapter() {
            public void focusGained(java.awt.event.FocusEvent evt) {
                cbEndPointIdFocusGained(evt);
            }
        });

        jbShutdownEP.setText("Shutdown Endpoint");
        jbShutdownEP.setPreferredSize(new java.awt.Dimension(125, 20));
        jbShutdownEP.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jbShutdownEPActionPerformed(evt);
            }
        });

        jbDeregisterSE.setText("Deregister Service ");
        jbDeregisterSE.setPreferredSize(new java.awt.Dimension(165, 20));
        jbDeregisterSE.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jbDeregisterSEActionPerformed(evt);
            }
        });

        jbRegisterSE.setText("Register Service ");
        jbRegisterSE.setMaximumSize(new java.awt.Dimension(100, 20));
        jbRegisterSE.setMinimumSize(new java.awt.Dimension(100, 20));
        jbRegisterSE.setPreferredSize(new java.awt.Dimension(100, 20));
        jbRegisterSE.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jbRegisterSEActionPerformed(evt);
            }
        });

        cbClusterAlias.setModel(new javax.swing.DefaultComboBoxModel(new String[] { "service1", "service2" }));
        cbClusterAlias.setPreferredSize(new java.awt.Dimension(56, 18));

        jLabel1.setText("Cluster Alias:");

        jpPassword.setText("admin");

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createSequentialGroup()
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addGroup(layout.createSequentialGroup()
                                .addComponent(jLabel1)
                                .addGap(18, 18, 18)
                                .addComponent(cbClusterAlias, 0, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                            .addGroup(layout.createSequentialGroup()
                                .addGap(81, 81, 81)
                                .addComponent(cbEndPointId, javax.swing.GroupLayout.PREFERRED_SIZE, 93, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(jLabel3))
                        .addGap(27, 27, 27)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(layout.createSequentialGroup()
                                .addComponent(jbRegisterSE, javax.swing.GroupLayout.PREFERRED_SIZE, 155, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(28, 28, 28)
                                .addComponent(jbShutdownEP, javax.swing.GroupLayout.PREFERRED_SIZE, 179, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(layout.createSequentialGroup()
                                .addComponent(jLabel2)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(jpPassword, javax.swing.GroupLayout.PREFERRED_SIZE, 78, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(27, 27, 27)
                                .addComponent(jbDeregisterSE, javax.swing.GroupLayout.PREFERRED_SIZE, 177, javax.swing.GroupLayout.PREFERRED_SIZE))))
                    .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                        .addGroup(layout.createSequentialGroup()
                            .addComponent(jbStickyEP, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addGap(18, 18, 18)
                            .addComponent(jbEndPointsI, javax.swing.GroupLayout.PREFERRED_SIZE, 132, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGroup(layout.createSequentialGroup()
                            .addComponent(jLabel4)
                            .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                            .addComponent(cbX, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGap(15, 15, 15)
                            .addComponent(jLabel5)
                            .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                            .addComponent(cbY, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGap(18, 18, 18)
                            .addComponent(jbSumXY, javax.swing.GroupLayout.PREFERRED_SIZE, 67, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                            .addComponent(jbMulXY, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))))
                .addContainerGap(30, Short.MAX_VALUE))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGap(10, 10, 10)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(jLabel1)
                        .addComponent(cbClusterAlias, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(jbRegisterSE, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jbShutdownEP, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(jLabel3)
                        .addComponent(cbEndPointId, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(jbDeregisterSE, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jpPassword, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jLabel2)))
                .addGap(30, 30, 30)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jbStickyEP, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jbEndPointsI, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(25, 25, 25)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel4)
                    .addComponent(cbX, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(cbY, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel5)
                    .addComponent(jbSumXY, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jbMulXY, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(20, Short.MAX_VALUE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

	private void jbEndPointsIActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jbEndPointsIActionPerformed
		try {
			Token lToken = TokenFactory.createToken("org.jwebsocket.plugins.loadbalancer", "clustersInfo");
			mClient.sendToken(lToken);
		} catch (Exception lEx) {
			Log(lEx.getClass().getSimpleName() + ":  " + lEx.getMessage() + "\n");
		}
	}//GEN-LAST:event_jbEndPointsIActionPerformed

	private void jbSumXYActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jbSumXYActionPerformed
		try {
			Integer lX = Integer.parseInt(cbX.getSelectedItem().toString());
			Integer lY = Integer.parseInt(cbY.getSelectedItem().toString());

			Token lToken = TokenFactory.createToken(ServiceSumPlugIn.NS_SERVICESUM, "sumXY");
			lToken.setInteger("x", lX);
			lToken.setInteger("y", lY);
			mClient.sendToken(lToken);
		} catch (Exception lEx) {
			Log(lEx.getClass().getSimpleName() + ":  " + lEx.getMessage() + "\n");
		}
	}//GEN-LAST:event_jbSumXYActionPerformed

	private void jbRegisterSEActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jbRegisterSEActionPerformed

		try {
			String lClusterAlias = cbClusterAlias.getSelectedItem().toString();
			if (lClusterAlias == null) {
				Log("The argument 'clusterAlias' cannot be null!" + "\n");
				return;
			}
			String lPassword = "";
			char[] lPass = jpPassword.getPassword();
			for (int i = 0; i < lPass.length; i++) {
				lPassword += lPass[i];
			}
			if (lPassword == null) {
				Log("The argument 'password' cannot be null!" + "\n");
				return;
			}

			final BaseTokenClient lClient = new BaseTokenClient();
			lClient.open("ws://localhost:8787/jWebSocket/jWebSocket");
			lClient.addTokenClientListener(new WebSocketClientTokenListener() {

				@Override
				public void processToken(WebSocketClientEvent aEvent, Token aToken) {
					if (!aToken.getType().equals("event") && !aToken.getType().equals("welcome")) {
						Log("Received Token: " + aToken.toString() + "\n");
					}
				}

				@Override
				public void processOpening(WebSocketClientEvent aEvent) {
					Log("Opening...\n");
				}

				@Override
				public void processOpened(WebSocketClientEvent aEvent) {
					Log("Opened.\n");
				}

				@Override
				public void processPacket(WebSocketClientEvent aEvent, WebSocketPacket aPacket) {
				}

				@Override
				public void processClosed(WebSocketClientEvent aEvent) {
					Log("Closed (" + aEvent.getData() + ").\n");
				}

				@Override
				public void processReconnecting(WebSocketClientEvent aEvent) {
					Log("Reconnecting...\n");
				}
			});

			Token lToken = TokenFactory.createToken("org.jwebsocket.plugins.loadbalancer", "registerServiceEndPoint");
			lToken.setString("clusterAlias", lClusterAlias);
			lToken.setString("password", lPassword);
			lClient.sendToken(lToken);
			if (lClusterAlias.equals("service1")) {
				ServiceSumPlugIn lServiceSumPlugIn = new ServiceSumPlugIn(lClient);
			} else if (lClusterAlias.equals("service2")) {
				ServiceMulPlugIn lServiceMulPlugIn = new ServiceMulPlugIn(lClient);
			}

			mServices.add(lClient);

		} catch (Exception lEx) {
			Log(lEx.getClass().getSimpleName() + ":  " + lEx.getMessage() + "\n");
		}
	}//GEN-LAST:event_jbRegisterSEActionPerformed

	private void jbStickyEPActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jbStickyEPActionPerformed
		try {
			Token lToken = TokenFactory.createToken("org.jwebsocket.plugins.loadbalancer", "stickyRoutes");
			mClient.sendToken(lToken);
		} catch (Exception lEx) {
			Log(lEx.getClass().getSimpleName() + ":  " + lEx.getMessage() + "\n");
		}
	}//GEN-LAST:event_jbStickyEPActionPerformed

	private void jbMulXYActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jbMulXYActionPerformed
		try {
			Integer lX = Integer.parseInt(cbX.getSelectedItem().toString());
			Integer lY = Integer.parseInt(cbY.getSelectedItem().toString());

			Token lToken = TokenFactory.createToken(ServiceMulPlugIn.NS_SERVICEMUL, "mulXY");
			lToken.setInteger("x", lX);
			lToken.setInteger("y", lY);
			mClient.sendToken(lToken);
		} catch (Exception lEx) {
			Log(lEx.getClass().getSimpleName() + ":  " + lEx.getMessage() + "\n");
		}
	}//GEN-LAST:event_jbMulXYActionPerformed

	private void cbEndPointIdFocusGained(java.awt.event.FocusEvent evt) {//GEN-FIRST:event_cbEndPointIdFocusGained
		try {
			Token lToken = TokenFactory.createToken("org.jwebsocket.plugins.loadbalancer", "stickyRoutes");
			mClient.sendToken(lToken);

		} catch (Exception lEx) {
			Log(lEx.getClass().getSimpleName() + ":  " + lEx.getMessage() + "\n");
		}
	}//GEN-LAST:event_cbEndPointIdFocusGained

	private void jbShutdownEPActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jbShutdownEPActionPerformed
		try {
			String lClusterAlias = cbClusterAlias.getSelectedItem().toString();
			if (lClusterAlias == null) {
				Log("The argument 'clusterAlias' cannot be null!" + "\n");
				return;
			}
			String lEndPointId = cbEndPointId.getSelectedItem().toString();
			if (lEndPointId == null) {
				Log("The argument 'endPointId' cannot be null!" + "\n");
				return;
			}
			String lPassword = "";
			char[] lPass = jpPassword.getPassword();
			for (int i = 0; i < lPass.length; i++) {
				lPassword += lPass[i];
			}
			if (lPassword == null) {
				Log("The argument 'password' cannot be null!" + "\n");
				return;
			}
			Token lToken = TokenFactory.createToken("org.jwebsocket.plugins.loadbalancer", "shutdownServiceEndPoint");
			lToken.setString("clusterAlias", lClusterAlias);
			lToken.setString("endPointId", lEndPointId);
			lToken.setString("password", lPassword);
			mClient.sendToken(lToken);

		} catch (Exception lEx) {
			Log(lEx.getClass().getSimpleName() + ":  " + lEx.getMessage() + "\n");
		}
	}//GEN-LAST:event_jbShutdownEPActionPerformed

	private void jbDeregisterSEActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jbDeregisterSEActionPerformed
		try {
			String lClusterAlias = cbClusterAlias.getSelectedItem().toString();
			if (lClusterAlias == null) {
				Log("The argument 'clusterAlias' cannot be null!" + "\n");
				return;
			}
			String lEndPointId = cbEndPointId.getSelectedItem().toString();
			if (lEndPointId == null) {
				Log("The argument 'endPointId' cannot be null!" + "\n");
				return;
			}
			String lPassword = "";
			char[] lPass = jpPassword.getPassword();
			for (int i = 0; i < lPass.length; i++) {
				lPassword += lPass[i];
			}
			if (lPassword == null) {
				Log("The argument 'password' cannot be null!" + "\n");
				return;
			}
			Token lToken = TokenFactory.createToken("org.jwebsocket.plugins.loadbalancer", "deregisterServiceEndPoint");
			lToken.setString("clusterAlias", lClusterAlias);
			lToken.setString("endPointId", lEndPointId);
			lToken.setString("password", lPassword);
			mClient.sendToken(lToken);

		} catch (Exception lEx) {
			Log(lEx.getClass().getSimpleName() + ":  " + lEx.getMessage() + "\n");
		}
	}//GEN-LAST:event_jbDeregisterSEActionPerformed

	private void Log(String aMessage) {
		synchronized (txaLog) {
			int lMAX = 1000;
			int lLineCount = txaLog.getLineCount();
			if (lLineCount > lMAX) {
				String lText = txaLog.getText();
				int lIdx = 0;
				int lCnt = lLineCount;
				while (lIdx < lText.length() && lCnt > lMAX) {
					if (lText.charAt(lIdx) == '\n') {
						lCnt--;
					}
					lIdx++;
				}
				txaLog.replaceRange("", 0, lIdx);
			}
			if (null != aMessage) {
				txaLog.append(aMessage);
			} else {
				txaLog.setText("");
			}
			txaLog.setCaretPosition(txaLog.getText().length());
		}
	}

	public static void loadEndPoints(List<Map<String, String>> mRoutes) {
		cbEndPointId.removeAllItems();
		String lKey = cbClusterAlias.getSelectedItem().toString();
		for (int lPos = 0; lPos < mRoutes.size(); lPos++) {
			if (mRoutes.get(lPos).get("clusterAlias").equals(lKey)) {
				cbEndPointId.addItem(mRoutes.get(lPos).get("endPointId").toString());
			}
		}
	}

	/**
	 * @param args the command line arguments
	 */
	public static void main(String args[]) {
		/*
		 * Set the Nimbus look and feel
		 */
		//<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /*
		 * If Nimbus (introduced in Java SE 6) is not available, stay
		 * with the default look and feel. For details see
		 * http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html
		 */
		try {
			for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
				if ("Nimbus".equals(info.getName())) {
					javax.swing.UIManager.setLookAndFeel(info.getClassName());
					break;
				}
			}
		} catch (ClassNotFoundException ex) {
			java.util.logging.Logger.getLogger(LoadBalancerDialog.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
		} catch (InstantiationException ex) {
			java.util.logging.Logger.getLogger(LoadBalancerDialog.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
		} catch (IllegalAccessException ex) {
			java.util.logging.Logger.getLogger(LoadBalancerDialog.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
		} catch (javax.swing.UnsupportedLookAndFeelException ex) {
			java.util.logging.Logger.getLogger(LoadBalancerDialog.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
		}
		//</editor-fold>

		/*
		 * Create and display the form
		 */
		java.awt.EventQueue.invokeLater(new Runnable() {

			public void run() {
				new LoadBalancerDialog().setVisible(true);
			}
		});
	}
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private static javax.swing.JComboBox cbClusterAlias;
    private static javax.swing.JComboBox cbEndPointId;
    private javax.swing.JComboBox cbX;
    private javax.swing.JComboBox cbY;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JButton jbDeregisterSE;
    private javax.swing.JButton jbEndPointsI;
    private javax.swing.JButton jbMulXY;
    private javax.swing.JButton jbRegisterSE;
    private javax.swing.JButton jbShutdownEP;
    private javax.swing.JButton jbStickyEP;
    private javax.swing.JButton jbSumXY;
    private javax.swing.JPasswordField jpPassword;
    // End of variables declaration//GEN-END:variables
}
