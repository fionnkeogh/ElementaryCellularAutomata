<script lang="ts">
	import { Rule } from "./Rule";
	import RuleBox from './Rule.svelte';
	import { CellularAutomata } from "./cellularAutomata";
	import type { Cell } from "./cell";
import Tooltip from "./Tooltip.svelte";

	export let colors: Array<string>;
	export let values: Array<boolean>;
	export let initValue: boolean;

	let curRule = "";

	let _rules = [
		"[true,true,true]->true",
		"[true,true,false]->true",
		"[true,false,true]->true",
		"[true,false,false]->false",
		"[false,true,true]->true",
		"[false,true,false]->false",
		"[false,false,true]->false",
		"[false,false,false]->false"
	];

	let eac = new CellularAutomata(colors, values);
	_rules.forEach(rule => {
		eac.addRule(new Rule(rule));
	});

	let state = eac.getCells();
	let prevStates = new Array<Array<Cell<boolean>>>();
	
	let cells = state.length;
	let times = 1;

	let entropy = getEntropy();

	function add() {
		if(eac.addRule(new Rule(curRule))) {
			_rules = _rules.concat(curRule);
		} else {
			alert("Rule already added or wrong");
		}
		console.log(eac.getRules());
	}

	function clear() {
		_rules = [];
	}

	function toggleCell(e: any) {
		let index = Number.parseInt(e.target.id);
		eac.toggelCell(index);
		state = eac.getCells();
		prevStates = new Array();
	}

	function addCell() {
		eac.addCell();
		state = eac.getCells();
		prevStates = new Array();
	}

	function removeCell() {
		if(eac.removeCell() != true) {
			alert("You can not remove any more cells.");
		} else {
			state = eac.getCells();
			prevStates = new Array();
		}
	}

	function simulate() {
		prevStates = new Array(...prevStates, state);
		eac.simulate();
		state = eac.getCells();
		entropy = getEntropy();
	}

	function simulateX() {
		for(let i = 0; i < times; i++) {
			simulate();
		}
	}

	function randomize() {
		eac.initRandom();
		state = eac.getCells();
		prevStates = new Array();
	}

	function deleteRule(index:number) {
		let toRemove = new Rule(_rules[index]);

		if(eac.removeRule(toRemove.toString())) {
			_rules.splice(index,1);
			_rules = new Array(..._rules);
		}
	}

	function setCells() {
		eac.setCells(cells);
		state = eac.getCells();
		prevStates = new Array();
	}

	function getEntropy() {
		let A = new Array(...prevStates);
		A.push(state);

		console.log(A);
		let t_count = 0;
		for(let i = 0; i < A.length; i++) {
			for(let k = 0; k < A[0].length; k++) {
				if(A[i][k].getValue() == true) {
					t_count++;
				}
			}
		}

		console.log(t_count)

		let p_t = t_count/(A.length*A[0].length);
		let p_f = 1-p_t;

		console.log(p_t)

		let H = -(p_t*Math.log2(p_t)+p_f*Math.log2(p_f))

		return H;
	}

</script>

<main>
	<h1>Elementary Cellular Automata</h1>
	<div class="cont">
		<div class="half">
			{#each _rules as rule, j}
				<RuleBox index={j} callback={deleteRule}>
					{rule}
				</RuleBox>
			{/each}
		</div>
		<div class="half">
			Rule-Site
			<br>
			<br>
			<input
				bind:value={curRule}
			>
			<button on:click={add}>
				Add new
			</button>
			<button on:click={clear}>
				Clear completed
			</button>
		</div>
	</div>
	<br>
	<div style="display: block; overflow: hidden;">
		Vis-Site
		<br>
		<div style="display: inline-flex;">
			<Tooltip title="Number of Cells (will reset the state)">
				<input type="range" bind:value={cells} min="1" max="200" on:change={setCells}>
			</Tooltip>
			<Tooltip title="Number of steps to simulate">
				<input type="range" style="margin-left: 100px;" bind:value={times} min="1" max="200">
			</Tooltip>
		</div>
		<br>
		<button on:click={addCell}>
			+
		</button>
		<button on:click={removeCell}>
			-
		</button>
		<button on:click={randomize}>
			random state
		</button>
		<button style="margin-left: 100px;" on:click={simulate}>
			simulate
		</button>
		<button on:click={simulateX}>
			simulate {times} times
		</button>
		<br>
		<div style="display: inline-flex;">
			<div>
				Current State: {cells} cells
			</div>
			<div style="margin-left: 100px;">Current Entropy: {#if entropy}
				{entropy}
				{:else}
				-
				{/if}
			</div>
		</div>
		
		
		<br>
		<div class="container">
			{#each state as cell}
				<div class="cell" style="background-color: {cell.getColor()}" id="{cell.getId().toString()}" on:click={toggleCell}></div>
			{/each}
		</div>
		<br>
		<div class="container" style="margin-top: -3px; margin-left: -4px;">
			<div style="display:grid; grid-gap: 0px; grid-template-columns: repeat({state.length});">
				{#each prevStates as _state, j}
					{#each _state as cell, k}
						<div class="cell" style="background-color: {cell.getColor()}; grid-column: {k+1}; grid-row: {prevStates.length-j}"></div>
					{/each}
				{/each}
			</div>
		</div>
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	.cont {
		display: flex;
	}

	.half {
		width: 45%;
	}

	.container {
		display: inline-flex;
		max-width: 100%;
		overflow: auto;
	}

	.cell {
		min-width: 20px;
		min-height: 20px;
		max-width: 20px;
		max-height: 20px;
		border-width: 1px;
		border-color: gray;
		border-style: solid;
		border-radius: 2px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>