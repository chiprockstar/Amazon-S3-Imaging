class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  before_action :set_s3_direct_post, only: [:new, :edit, :create, :update]

  # GET /users
  # GET /users.json
  def index
    @users = User.all.order("created_at desc").paginate(:page => params[:page], :per_page => 20)
    session[:page] = params[:page]
    #@carousel = User.all.order("created_at desc")
  end

  # GET /users/1
  # GET /users/1.json
  def show
  end

  # GET /users/new
  def new
    @user = User.new
    @edit = nil
  end

  # GET /users/1/edit
  def edit
    @edit = true
  end

  # POST /users
  # POST /users.json
  def create
  #  binding.pry
    avatar_url = params[:avatar_url]
    name = params[:name]
    name.reverse!
    params[:avatar_url] = nil
    params[:name] = nil
    avatar_url.each_with_index do |avatar_url, index|
      @user = User.new(user_params)
      @user.avatar_url = avatar_url
      @user.name = name[index]
      @user.save
    end


    respond_to do |format|
      if @user.save
        format.html { redirect_to users_path, notice: 'Images were successfully added to library.' }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to users_path, notice: 'Image comments were successfully updated.' }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, notice: 'User was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:name, :avatar_url)
    end

    def set_s3_direct_post
      @s3_direct_post = S3_BUCKET.presigned_post(key: "uploads/#{SecureRandom.uuid}/${filename}", success_action_status: '201', acl: 'public-read')
    end
end
