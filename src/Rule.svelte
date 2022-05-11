<script lang="ts">
    import IconButton from '@smui/icon-button';

    export let index: number;
    export let callback: (id:number) => void;
    function _delete(e: any) {
        callback(index);
    }
</script>

<div class="box">
	<slot class="content"></slot>
    <div class="material_icons">
        <IconButton class="material-icons" on:click={_delete}>delete</IconButton>
    </div>
</div>

<style>
	.box {
		width: 300px;
        height: 32px;
		border: 1px solid #aaa;
		border-radius: 2px;
		box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
		margin-top: 10px;
        text-align: center;
        line-height: 32px;
	}
    .content {
        margin-top: 5px;
    }
    .material_icons {
        display: flex;
        align-items: center;
        width: 30px;
        height: 22px;
        float: right;
        margin-right: 1px;
        margin-top: 1px;
        margin-bottom: 1px;
        padding-top: 8px;
        padding-right: 13px;
        overflow: hidden;
    }
</style>