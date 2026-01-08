!function(){"use strict";window.customCards=window.customCards||[],window.customCards.push({type:"reachy-mini-3d-card",name:"Reachy Mini 3D Card",description:"Real-time 3D visualization of Reachy Mini robot with direct daemon connection",preview:!0,documentationURL:"https://github.com/Desmond-Dong/ha-reachy-mini-card"}),(async()=>{try{const t=t=>new Promise((e,o)=>{const n=document.createElement("script");n.src=t,n.onload=e,n.onerror=o,document.head.appendChild(n)});let e,o,n;window.THREE||await t("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"),await t("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/controls/OrbitControls.js"),await t("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/loaders/STLLoader.js"),window.LitElement?(e=window.LitElement,o=window.html,n=window.css):(await t("https://cdn.jsdelivr.net/npm/@lit/reactive-element@1.6.0/reactive-element.js"),await t("https://cdn.jsdelivr.net/npm/lit@3.1.0/lit-element.js"),e=window.LitElement||window.LitElementElement,o=window.html||((t,...e)=>({strings:t,values:e})),n=window.css||((t,...e)=>t.join("")));class ReachyMini3DCard extends e{static get properties(){return{hass:Object,config:Object,_editing:{type:Boolean,state:!0},_loaded:{type:Boolean,state:!0},_connectionStatus:{type:String,state:!0},_robotData:{type:Object,state:!0}}}static get styles(){return n`
          :host {
            display: block;
            width: 100%;
            position: relative;
          }
          ha-card {
            overflow: hidden;
            border-radius: var(--ha-card-border-radius, 12px);
            box-shadow: var(--ha-card-box-shadow, none);
          }
          .card-container {
            width: 100%;
            position: relative;
          }
          #canvas-container {
            width: 100%;
            height: 400px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
          }
          .status-overlay {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.6);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-family: var(--font-family, Roboto);
            font-size: 12px;
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .status-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #4caf50;
          }
          .status-indicator.connecting {
            background: #ff9800;
            animation: pulse 1s infinite;
          }
          .status-indicator.error {
            background: #f44336;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .controls {
            position: absolute;
            bottom: 10px;
            right: 10px;
            display: flex;
            gap: 8px;
          }
          .control-btn {
            background: rgba(255,255,255,0.9);
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 20px;
            transition: all 0.2s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }
          .control-btn:hover {
            background: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          }
          .edit-mode {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 100;
          }
          .edit-btn {
            background: var(--primary-color, #03a9f4);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: all 0.2s;
          }
          .edit-btn:hover {
            background: var(--primary-color, #0288d1);
            transform: scale(1.1);
          }
          .config-panel {
            position: absolute;
            top: 0;
            right: 0;
            width: 320px;
            height: 100%;
            background: white;
            box-shadow: -4px 0 16px rgba(0,0,0,0.1);
            border-radius: 12px 0 0 12px;
            padding: 20px;
            overflow-y: auto;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
          }
          .config-panel.open {
            transform: translateX(0);
          }
          .config-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
          }
          .config-header h3 {
            margin: 0;
            color: #333;
            font-size: 18px;
          }
          .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
          }
          .close-btn:hover {
            color: #333;
          }
          .config-item {
            margin-bottom: 16px;
          }
          .config-item label {
            display: block;
            margin-bottom: 6px;
            font-size: 13px;
            color: #555;
            font-weight: 500;
          }
          .config-item input[type="text"],
          .config-item input[type="number"] {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
            transition: border-color 0.2s;
          }
          .config-item input:focus {
            outline: none;
            border-color: var(--primary-color, #03a9f4);
            box-shadow: 0 0 0 3px rgba(3, 169, 244, 0.1);
          }
          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: #666;
            z-index: 50;
          }
          .error-message {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #f44336;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
        `}static getStubConfig(){return{daemon_host:"localhost",daemon_port:3333,height:400,show_controls:!0,auto_rotate:!1}}setConfig(t){t.daemon_host||t.daemon_port||t.entity_prefix&&console.warn("entity_prefix is deprecated. Please use daemon_host and daemon_port instead."),this.config={...ReachyMini3DCard.getStubConfig(),...t}}getCardSize(){return Math.ceil(this.config.height/50)}constructor(){super(),this._loaded=!1,this._editing=!1,this._connectionStatus="disconnected",this._robotData={headJoints:null,headPose:null,antennas:[0,0],passiveJoints:null},this.ws=null,this.reconnectAttempts=0,this.maxReconnectAttempts=3}connectedCallback(){super.connectedCallback(),requestAnimationFrame(()=>{this.initThreeJS().catch(t=>{console.error("Failed to initialize Three.js:",t),this._loaded=!0})})}disconnectedCallback(){super.disconnectedCallback(),this.cleanup()}async initThreeJS(){const t=this.shadowRoot?.getElementById("canvas-container");if(!t)return await new Promise(t=>setTimeout(t,100)),this.initThreeJS();try{this.scene=new THREE.Scene,this.scene.background=new THREE.Color(15790320);const e=t.clientWidth,o=this.config?.height||400;this.camera=new THREE.PerspectiveCamera(50,e/o,.01,1e3),this.camera.position.set(.3,.3,.5),this.renderer=new THREE.WebGLRenderer({antialias:!0,alpha:!0}),this.renderer.setSize(e,o),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=THREE.PCFSoftShadowMap,t.appendChild(this.renderer.domElement),this.controls=new THREE.OrbitControls(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.05,this.controls.minDistance=.2,this.controls.maxDistance=1;const n=new THREE.AmbientLight(16777215,.6);this.scene.add(n);const i=new THREE.DirectionalLight(16777215,.8);i.position.set(1,1,1),i.castShadow=!0,this.scene.add(i);const s=new THREE.GridHelper(.4,20,8947848,13421772);this.scene.add(s),await this.loadRobotModel(),this._loaded=!0,this.connectWebSocket(),this.animate(),window.addEventListener("resize",this.onWindowResize.bind(this))}catch(t){throw console.error("Error initializing Three.js:",t),this._loaded=!0,this._connectionStatus="error",t}}async loadRobotModel(){try{const t=(()=>{const t=document.getElementsByTagName("script"),e=t[t.length-1],o=e?.src||"";return o?o.substring(0,o.lastIndexOf("/")+1):"/hacsfiles/reachy-mini-3d-card/"})();console.log("Card base path:",t);const e=(await import(t+"lib/urdf-loader.js")).default,o=t+"assets/reachy-mini.urdf",n=new e;n.workingPath=t+"assets/",n.pathPrefix=e=>t+"assets/"+e,this.robot=await n.load(o),this.scene.add(this.robot),this.robot.position.set(0,0,0),this.joints=this.robot.joints,console.log("Robot model loaded successfully")}catch(t){throw console.error("Failed to load URDF model:",t),this._connectionStatus="error",t}}connectWebSocket(){const t=this.config.daemon_host||"localhost",e=this.config.daemon_port||3333;if(this.reconnectAttempts>=this.maxReconnectAttempts)return console.warn(`Max reconnection attempts (${this.maxReconnectAttempts}) reached. Please check if the daemon is running.`),void(this._connectionStatus="error");try{const o=`ws://${t}:${e}/api/state/ws/full?frequency=20&with_head_pose=true&use_pose_matrix=true&with_head_joints=true&with_antenna_positions=true&with_passive_joints=true`;console.log(`Connecting to Reachy Mini daemon: ${o}`),this._connectionStatus="connecting",this.ws=new WebSocket(o),this.ws.onopen=()=>{console.log("WebSocket connected to Reachy Mini daemon"),this._connectionStatus="connected",this.reconnectAttempts=0},this.ws.onmessage=t=>{try{const e=JSON.parse(t.data);this.updateRobotFromWebSocket(e)}catch(t){console.error("Failed to parse WebSocket message:",t)}},this.ws.onerror=t=>{console.error("WebSocket error:",t),this._connectionStatus="error"},this.ws.onclose=()=>{if(console.log("WebSocket connection closed"),this._connectionStatus="disconnected",this.reconnectAttempts<this.maxReconnectAttempts){this.reconnectAttempts++;const t=Math.min(1e3*Math.pow(2,this.reconnectAttempts),1e4);console.log(`Reconnecting in ${t}ms... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`),setTimeout(()=>this.connectWebSocket(),t)}else console.warn("Max reconnection attempts reached"),this._connectionStatus="error"}}catch(t){console.error("Failed to create WebSocket connection:",t),this._connectionStatus="error"}}updateRobotFromWebSocket(t){if(this.robot&&this.robot.joints)try{if(t.head_joints&&Array.isArray(t.head_joints)&&7===t.head_joints.length){const e=t.head_joints;this.robot.setJointValue("yaw_body",e[0]||0),this.robot.setJointValue("stewart_1",e[1]||0),this.robot.setJointValue("stewart_2",e[2]||0),this.robot.setJointValue("stewart_3",e[3]||0),this.robot.setJointValue("stewart_4",e[4]||0),this.robot.setJointValue("stewart_5",e[5]||0),this.robot.setJointValue("stewart_6",e[6]||0),this._robotData.headJoints=e}if(t.antennas_position&&Array.isArray(t.antennas_position)&&2===t.antennas_position.length){const[e,o]=t.antennas_position;this.robot.setJointValue("left_antenna",-e),this.robot.setJointValue("right_antenna",-o),this._robotData.antennas=t.antennas_position}if(t.head_pose){const e=Array.isArray(t.head_pose)?t.head_pose:t.head_pose.m;e&&16===e.length&&(this._robotData.headPose=e)}t.passive_joints&&Array.isArray(t.passive_joints)&&t.passive_joints.length>=21&&(this._robotData.passiveJoints=t.passive_joints),this._connectionStatus="connected"}catch(t){console.error("Error updating robot state:",t),this._connectionStatus="error"}}animate(){this.renderer&&(requestAnimationFrame(this.animate.bind(this)),this.controls&&this.controls.update(),this.config.auto_rotate&&this.robot&&(this.robot.rotation.y+=.005),this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera))}onWindowResize(){if(!this.camera||!this.renderer)return;const t=this.shadowRoot.getElementById("canvas-container");if(!t)return;const e=t.clientWidth,o=this.config.height||400;this.camera.aspect=e/o,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,o)}cleanup(){this.ws&&(this.ws.close(),this.ws=null),window.removeEventListener("resize",this.onWindowResize.bind(this)),this.renderer&&this.renderer.dispose()}toggleEditMode(){this._editing=!this._editing}updateConfig(t){this.config={...this.config,...t},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0})),(t.daemon_host||t.daemon_port)&&(this.ws&&this.ws.close(),this.reconnectAttempts=0,this.connectWebSocket())}render(){return o`
          <ha-card>
            <div class="card-container">
              ${this._editing?o`
                <div class="config-panel open">
                  <div class="config-header">
                    <h3>⚙️ Configuration</h3>
                    <button class="close-btn" @click="${()=>this.toggleEditMode()}">×</button>
                  </div>

                  <div class="config-item">
                    <label>Daemon Host</label>
                    <input type="text"
                           .value="${this.config?.daemon_host||"localhost"}"
                           @change="${t=>this.updateConfig({daemon_host:t.target.value})}">
                  </div>

                  <div class="config-item">
                    <label>Daemon Port</label>
                    <input type="number"
                           .value="${this.config?.daemon_port||3333}"
                           @change="${t=>this.updateConfig({daemon_port:parseInt(t.target.value)})}">
                  </div>

                  <div class="config-item">
                    <label>Height (${this.config?.height||400}px)</label>
                    <input type="range"
                           min="200"
                           max="800"
                           step="50"
                           .value="${this.config?.height||400}"
                           @input="${t=>this.updateConfig({height:parseInt(t.target.value)})}">
                  </div>

                  <div class="config-item">
                    <label>
                      <input type="checkbox"
                             ?checked="${this.config?.auto_rotate||!1}"
                             @change="${t=>this.updateConfig({auto_rotate:t.target.checked})}">
                      Auto Rotate
                    </label>
                  </div>

                  <div class="config-item">
                    <p style="font-size:11px;color:#666;margin:8px 0;">
                      ℹ️ Make sure Reachy Mini daemon is running on the specified host and port.
                    </p>
                  </div>
                </div>
              `:""}

              <div id="canvas-container" style="height:${this.config?.height||400}px">
                ${this._loaded?"":o`
                  <div class="loading-overlay">
                    <div style="text-align:center">
                      <div style="font-size:24px;margin-bottom:8px">🤖</div>
                      <div>Loading 3D model...</div>
                    </div>
                  </div>
                `}

                ${this._loaded&&"error"===this._connectionStatus?o`
                  <div class="error-message">
                    <div style="font-size:48px;">⚠️</div>
                    <div style="font-size:16px;margin-top:10px;">
                      <strong>Connection Failed</strong><br>
                      <small style="color:#666;">Cannot connect to Reachy Mini daemon</small><br>
                      <small style="color:#999;font-size:11px;">
                        Host: ${this.config.daemon_host}:${this.config.daemon_port}<br>
                        Please check if the daemon is running
                      </small>
                    </div>
                  </div>
                `:""}
              </div>

              <!-- 状态指示器 -->
              ${this._loaded?o`
                <div class="status-overlay">
                  <span class="status-indicator ${"connecting"===this._connectionStatus?"connecting":"error"===this._connectionStatus?"error":""}"></span>
                  <span>
                    ${"connected"===this._connectionStatus?"🟢 Connected":""}
                    ${"connecting"===this._connectionStatus?"🟡 Connecting...":""}
                    ${"disconnected"===this._connectionStatus?"🔴 Disconnected":""}
                    ${"error"===this._connectionStatus?"❌ Connection Error":""}
                  </span>
                </div>
              `:""}

              ${!1!==this.config?.show_controls?o`
                <div class="controls">
                  <button class="control-btn" @click="${()=>this.resetCamera()}" title="Reset View">🎯</button>
                  <button class="control-btn" @click="${()=>this.toggleAutoRotate()}" title="Toggle Rotation">🔄</button>
                </div>
              `:""}

              <div class="edit-mode">
                <button class="edit-btn" @click="${()=>this.toggleEditMode()}" title="Edit Configuration">⚙️</button>
              </div>
            </div>
          </ha-card>
        `}resetCamera(){this.camera&&this.controls&&(this.camera.position.set(.3,.3,.5),this.controls.reset())}toggleAutoRotate(){this.updateConfig({auto_rotate:!this.config.auto_rotate})}}customElements.define("reachy-mini-3d-card",ReachyMini3DCard),console.log("Reachy Mini 3D Card (Direct Connection) registered successfully")}catch(t){console.error("Error initializing Reachy Mini 3D Card:",t)}})()}();
//# sourceMappingURL=reachy-mini-3d-card.js.map
