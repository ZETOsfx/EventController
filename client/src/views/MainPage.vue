<template>
	<div class="intro">
		<link rel="stylesheet" href="/css/style_new.css">
		<link href="/css/bootstrap.min.css" rel="stylesheet">
		<link href="/css/fa.min.css" rel="stylesheet" />
		<link href="/css/tabcolor.css" rel="stylesheet"/>

		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<!----===== Boxicons CSS ===== -->
		<link href="/css/boxicons.min.css" rel="stylesheet">
		<div class="container">
		<h6 class="text mt-4"> События К3 МФ МГТУ </h6>
		<div class="p-1 m-0">
			<!-- <div id="miniframe"> -->
			<!-- <iframe src="http://www.localhost:5173" class="myminiframe collectonme"> </div>" scrolling="no" id="myminiframe"> </iframe> -->
			<!-- </div>      -->
			<div class="row">
				<div v-for="ad in this.ads" class="col-lg-4 col-md-6 col-sm-12 col-xs-12 mb-3 mb-sm-0 mt-1 gx-2">
					<div class="card h-100">
						<div class="card-header">{{ ad.author }}</div>
						<div class="card-body">
							<h5 class="card-title">{{ ad.name }}</h5>
							<p class="card-text">{{ ad.comment }}</p>
						</div>
						<div v-if="ad.timeOfLife === '9999-01-01'" class="card-footer">
							Актуально: бессрочно
						</div>
						<div v-if="ad.timeOfLife !== '9999-01-01'" class="card-footer">
							Актуально до: {{ ad.timeOfLife }}
						</div>
					</div>
				</div>
			</div>
		</div>
		</div>
	</div>
</template>
  
<script>
	export default {
		inject: ['getSocket', 'getSession'],
		data() {
			return {
				ads: [],
				socket: {},
				session: {}
			}
		},
		methods: {
			connect() {
				this.session = this.getSession();
				this.socket = this.getSocket();
			},
			async getAds() {
				let response = await fetch(`/note/public`, {
					method: 'GET',
					// THIS IS IMPORTANT
					headers: new Headers({
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'Access-Control-Allow-Origin': '*'
					})
				});
				this.ads = (await response.json());
			}
		},
		async mounted() {
			this.connect();
			await this.getAds(); 
			this.emitter.emit('refresh', JSON.stringify(localStorage.getItem('user')).token);
		}
	}
</script>